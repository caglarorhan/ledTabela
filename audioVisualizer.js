/**
 * LED Tabela - Audio Visualizer Module
 * Transforms GitHub contribution chart into a real-time audio spectrum analyzer
 * 
 * Technical Specs:
 * - 30 FPS animation loop
 * - Web Audio API with AnalyserNode
 * - FFT Size: 512 (256 frequency bins)
 * - Smoothing: 0.75 (always enabled)
 * - Bass boost: 1.5-2x on low frequencies
 * - Maps to 54 columns × 7 rows (GitHub chart dimensions)
 */

// Global audio stream storage - persists between visualizer instances
let globalAudioStream = null;

class AudioVisualizer {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.audioStream = null;
        this.animationId = null;
        this.isActive = false;
        
        // Configuration
        this.FPS = 30;
        this.frameDelay = 1000 / this.FPS;
        this.lastFrameTime = 0;
        
        // Audio processing
        this.fftSize = 512;
        this.frequencyData = null;
        this.smoothingConstant = 0.75;
        
        // Grid dimensions (calculated from actual chart)
        this.columns = 0;
        this.rows = 0;
        this.rectGrid = []; // 2D array for fast rect access
        
        // Visualization settings
        this.currentColorScheme = 'amplitudeGradient';
        this.bassBoost = 1.75; // Midpoint between 1.5-2x
        
        // State tracking
        this.silenceCounter = 0;
        this.silenceThreshold = 90; // ~3 seconds at 30fps
    }
    
    /**
     * Initialize the audio visualizer
     * Requests audio capture and sets up Web Audio API
     */
    async init() {
        console.log('🎵 Initializing Audio Visualizer...');
        
        try {
            // Check if we have a valid existing stream
            if (globalAudioStream) {
                const audioTracks = globalAudioStream.getAudioTracks();
                if (audioTracks.length > 0 && audioTracks[0].readyState === 'live') {
                    console.log('✅ Reusing existing audio stream:', audioTracks[0].label);
                    this.audioStream = globalAudioStream;
                } else {
                    console.log('⚠️ Previous stream is no longer valid, requesting new one');
                    globalAudioStream = null;
                }
            }
            
            // Request new audio capture if we don't have a valid stream
            if (!this.audioStream) {
                console.log('📺 Requesting audio capture from user...');
                this.audioStream = await navigator.mediaDevices.getDisplayMedia({
                    audio: {
                        echoCancellation: false,
                        noiseSuppression: false,
                        autoGainControl: false
                    },
                    video: {
                        width: 1,
                        height: 1,
                        frameRate: 1
                    }
                });
                
                console.log('✅ Media stream captured');
                
                // Check if audio track exists
                const audioTracks = this.audioStream.getAudioTracks();
                if (audioTracks.length === 0) {
                    throw new Error('No audio track in selected source. Make sure to check "Share audio" when selecting a tab.');
                }
                
                console.log('✅ Audio track found:', audioTracks[0].label);
                
                // Store in global for reuse
                globalAudioStream = this.audioStream;
                
                // Monitor stream ending (monitor all tracks)
                this.audioStream.getTracks().forEach(track => {
                    track.onended = () => {
                        console.log(`${track.kind} track ended, clearing global stream`);
                        globalAudioStream = null;
                        this.stop();
                    };
                });
            }
            
            // Setup Web Audio API
            this.audioContext = new AudioContext();
            this.analyser = this.audioContext.createAnalyser();
            
            // Configure analyser
            this.analyser.fftSize = this.fftSize;
            this.analyser.smoothingTimeConstant = this.smoothingConstant;
            this.analyser.minDecibels = -90;
            this.analyser.maxDecibels = -10;
            
            // Create frequency data array
            this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
            
            // Connect audio stream to analyser
            const source = this.audioContext.createMediaStreamSource(this.audioStream);
            source.connect(this.analyser);
            
            console.log(`✅ Analyser configured: ${this.analyser.frequencyBinCount} bins`);
            
            // Setup grid references
            this.setupGridReferences();
            
            return true;
            
        } catch (error) {
            console.error('❌ Audio capture failed:', error);
            console.error('Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            
            if (error.name === 'NotAllowedError') {
                throw new Error('Audio capture denied. Please allow access to visualize audio.');
            } else if (error.name === 'NotFoundError') {
                throw new Error('No audio source available. Please play audio and try again.');
            } else if (error.name === 'NotSupportedError') {
                throw new Error('Audio capture not supported. Please use Chrome/Edge browser version 94 or later.');
            } else if (error.message.includes('No audio track')) {
                throw new Error('No audio track selected. Make sure to check "Share audio" checkbox when selecting a tab.');
            } else {
                throw new Error(`Audio capture failed: ${error.message}`);
            }
        }
    }
    
    /**
     * Setup grid references for fast rendering
     * Caches all cell elements in a 2D array
     */
    setupGridReferences() {
        const table = document.querySelector('table.ContributionCalendar-grid');
        
        console.log('Found contribution table');
        
        // Get all rows (days of the week)
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        console.log(`Found ${rows.length} rows`);
        
        if (rows.length === 0) {
            throw new Error('No rows found in contribution chart');
        }
        
        // Build 2D array: rectGrid[column][row]
        // First, collect all cells by their position
        const columnMap = new Map();
        
        rows.forEach((row, rowIndex) => {
            const cells = Array.from(row.querySelectorAll('td.ContributionCalendar-day'));
            cells.forEach((cell, colIndex) => {
                if (!columnMap.has(colIndex)) {
                    columnMap.set(colIndex, []);
                }
                columnMap.get(colIndex)[rowIndex] = cell;
            });
        });
        
        // Convert to array and get dimensions
        this.columns = columnMap.size;
        this.rows = rows.length;
        
        console.log(`Grid dimensions: ${this.columns} columns × ${this.rows} rows`);
        
        if (this.columns === 0 || this.rows === 0) {
            throw new Error('Invalid grid dimensions');
        }
        
        // Build rectGrid as 2D array
        this.rectGrid = [];
        for (let col = 0; col < this.columns; col++) {
            this.rectGrid[col] = columnMap.get(col) || [];
        }
        
        console.log(`✅ Grid setup complete: ${this.columns}x${this.rows} = ${this.columns * this.rows} cells`);
    }
    
    /**
     * Start the visualization loop
     */
    start() {
        if (this.isActive) {
            console.warn('Visualizer already active');
            return;
        }
        
        this.isActive = true;
        console.log('▶️ Starting audio visualization');
        this.animate();
    }
    
    /**
     * Animation loop - runs at 30 FPS
     */
    animate(timestamp = 0) {
        if (!this.isActive) return;
        
        // Throttle to target FPS
        if (timestamp - this.lastFrameTime >= this.frameDelay) {
            this.processAudioFrame();
            this.lastFrameTime = timestamp;
        }
        
        this.animationId = requestAnimationFrame((ts) => this.animate(ts));
    }
    
    /**
     * Process single audio frame and update visualization
     */
    processAudioFrame() {
        // Get frequency data from analyser
        this.analyser.getByteFrequencyData(this.frequencyData);
        
        // Check for silence
        const isSilent = this.detectSilence();
        if (isSilent) {
            this.renderSilenceState();
            return;
        }
        
        // Reset silence counter
        this.silenceCounter = 0;
        
        // Map frequency data to grid
        this.mapFrequencyToGrid();
    }
    
    /**
     * Detect if audio is silent (no meaningful signal)
     */
    detectSilence() {
        const threshold = 5;
        const silentBins = Array.from(this.frequencyData)
            .filter(val => val < threshold).length;
        
        const silenceRatio = silentBins / this.frequencyData.length;
        
        if (silenceRatio > 0.95) {
            this.silenceCounter++;
            return this.silenceCounter > this.silenceThreshold;
        }
        
        return false;
    }
    
    /**
     * Render "waiting for audio" state
     */
    renderSilenceState() {
        // Pulse animation on grid
        const pulseIntensity = Math.sin(Date.now() / 500) * 0.5 + 0.5;
        const pulseColor = `rgba(100, 150, 200, ${pulseIntensity * 0.3})`;
        
        for (let col = 0; col < this.columns; col++) {
            if (!this.rectGrid[col]) continue;
            for (let row = 0; row < this.rows; row++) {
                const cell = this.rectGrid[col][row];
                if (cell) {
                    cell.style.setProperty('background-color', pulseColor, 'important');
                }
            }
        }
    }
    
    /**
     * Map frequency bins to GitHub grid columns and update visualization
     */
    mapFrequencyToGrid() {
        // Use only first 70% of frequency bins (most music energy is here)
        // This spreads the useful frequency range across all columns
        const usableBins = Math.floor(this.frequencyData.length * 0.7);
        const binsPerColumn = Math.floor(usableBins / this.columns);
        
        for (let col = 0; col < this.columns; col++) {
            // Average frequency bins for this column
            let sum = 0;
            const startBin = col * binsPerColumn;
            const endBin = Math.min(startBin + binsPerColumn, usableBins);
            
            for (let i = startBin; i < endBin; i++) {
                sum += this.frequencyData[i];
            }
            
            let avgAmplitude = sum / (endBin - startBin);
            
            // Apply bass boost to lower frequencies (first ~25% of columns)
            if (col < this.columns * 0.25) {
                const boostFactor = this.bassBoost - ((col / (this.columns * 0.25)) * (this.bassBoost - 1.0));
                avgAmplitude *= boostFactor;
            } else {
                // Apply mid/high frequency boost (rest of columns)
                // Gradually increase boost from 1.3x to 2.0x for higher frequencies
                const highBoostStart = 1.3;
                const highBoostEnd = 2.0;
                const highFreqPosition = (col - this.columns * 0.25) / (this.columns * 0.75);
                const highBoostFactor = highBoostStart + (highFreqPosition * (highBoostEnd - highBoostStart));
                avgAmplitude *= highBoostFactor;
            }
            
            // Overall amplitude boost (makes everything more visible)
            avgAmplitude *= 1.5;
            
            // Normalize to 0-255 range
            avgAmplitude = Math.min(avgAmplitude, 255);
            
            // Map amplitude to row height (0-7) with exponential curve for better visibility
            const normalizedAmplitude = avgAmplitude / 255;
            // Apply power curve to make smaller values more visible
            const exponentialAmplitude = Math.pow(normalizedAmplitude, 0.7);
            const activeRows = Math.round(exponentialAmplitude * this.rows);
            
            // Update column visualization
            this.updateColumn(col, activeRows, normalizedAmplitude);
        }
    }
    
    /**
     * Update a single column with amplitude bars
     */
    updateColumn(col, activeRows, normalizedAmplitude) {
        if (!this.rectGrid[col]) {
            console.warn(`Column ${col} not found in grid`);
            return;
        }
        
        for (let row = 0; row < this.rows; row++) {
            const cell = this.rectGrid[col][row];
            if (!cell) continue;
            
            // Bottom-up bars (row 0 = top, row 6 = bottom in visual)
            // We want to light from bottom up, so check from bottom
            const visualRow = this.rows - 1 - row;
            
            if (visualRow < activeRows) {
                // Calculate row intensity (bottom = brighter)
                const rowIntensity = 1 - (visualRow / activeRows) * 0.3;
                const color = this.getColorForAmplitude(
                    normalizedAmplitude * rowIntensity,
                    col,
                    row
                );
                cell.style.setProperty('background-color', color, 'important');
            } else {
                // Inactive rows - GitHub default gray
                cell.style.setProperty('background-color', '#ebedf0', 'important');
            }
        }
    }
    
    /**
     * Get color based on current color scheme and amplitude
     */
    getColorForAmplitude(amplitude, col, row) {
        const scheme = this.currentColorScheme;
        
        if (scheme === 'amplitudeGradient') {
            return this.getAmplitudeGradientColor(amplitude);
        } else if (scheme === 'frequencyRainbow') {
            return this.getFrequencyRainbowColor(col, amplitude);
        } else {
            // Use existing color schemes from colorCharts
            return this.getColorChartColor(scheme, amplitude);
        }
    }
    
    /**
     * Amplitude Gradient color scheme
     * Low → Dark Blue, Medium → Green/Cyan, High → Red/Orange
     */
    getAmplitudeGradientColor(amplitude) {
        if (amplitude < 0.3) {
            // Low amplitude: Dark blue → Blue
            const t = amplitude / 0.3;
            return this.interpolateColor('#1a1a3e', '#4040ff', t);
        } else if (amplitude < 0.7) {
            // Medium amplitude: Blue → Cyan/Green
            const t = (amplitude - 0.3) / 0.4;
            return this.interpolateColor('#4040ff', '#00ff88', t);
        } else {
            // High amplitude: Cyan/Green → Red/Orange
            const t = (amplitude - 0.7) / 0.3;
            return this.interpolateColor('#00ff88', '#ff4444', t);
        }
    }
    
    /**
     * Frequency Rainbow color scheme
     * Bass → Red/Orange, Mids → Yellow/Green, Treble → Blue/Purple
     */
    getFrequencyRainbowColor(col, amplitude) {
        const position = col / this.columns;
        
        let color;
        if (position < 0.33) {
            // Bass: Red → Orange
            const t = position / 0.33;
            color = this.interpolateColor('#ff3030', '#ff8030', t);
        } else if (position < 0.66) {
            // Mids: Orange → Yellow → Green
            const t = (position - 0.33) / 0.33;
            if (t < 0.5) {
                color = this.interpolateColor('#ff8030', '#ffff00', t * 2);
            } else {
                color = this.interpolateColor('#ffff00', '#00ff00', (t - 0.5) * 2);
            }
        } else {
            // Treble: Green → Blue → Purple
            const t = (position - 0.66) / 0.34;
            if (t < 0.5) {
                color = this.interpolateColor('#00ff00', '#3030ff', t * 2);
            } else {
                color = this.interpolateColor('#3030ff', '#ff00ff', (t - 0.5) * 2);
            }
        }
        
        // Apply amplitude dimming
        return this.applyAmplitudeDimming(color, amplitude);
    }
    
    /**
     * Use existing color chart schemes from colorCharts.js
     */
    getColorChartColor(schemeName, amplitude) {
        if (typeof colorCharts === 'undefined' || !colorCharts[schemeName]) {
            console.warn(`Color scheme ${schemeName} not found, using default`);
            return this.getAmplitudeGradientColor(amplitude);
        }
        
        const colors = colorCharts[schemeName];
        
        // Map amplitude to color index (skip first color which is usually gray/white)
        const colorIndex = Math.floor(amplitude * (colors.length - 1)) + 1;
        const clampedIndex = Math.min(Math.max(colorIndex, 1), colors.length - 1);
        
        return colors[clampedIndex];
    }
    
    /**
     * Interpolate between two hex colors
     */
    interpolateColor(color1, color2, t) {
        const c1 = this.hexToRgb(color1);
        const c2 = this.hexToRgb(color2);
        
        const r = Math.round(c1.r + (c2.r - c1.r) * t);
        const g = Math.round(c1.g + (c2.g - c1.g) * t);
        const b = Math.round(c1.b + (c2.b - c1.b) * t);
        
        return this.rgbToHex(r, g, b);
    }
    
    /**
     * Apply amplitude-based dimming to a color
     */
    applyAmplitudeDimming(color, amplitude) {
        const rgb = this.hexToRgb(color);
        
        const dimFactor = 0.2 + (amplitude * 0.8); // 20% - 100% brightness
        
        const r = Math.round(rgb.r * dimFactor);
        const g = Math.round(rgb.g * dimFactor);
        const b = Math.round(rgb.b * dimFactor);
        
        return this.rgbToHex(r, g, b);
    }
    
    /**
     * Convert hex color to RGB
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }
    
    /**
     * Convert RGB to hex color
     */
    rgbToHex(r, g, b) {
        return '#' + [r, g, b]
            .map(x => Math.max(0, Math.min(255, x)).toString(16).padStart(2, '0'))
            .join('');
    }
    
    /**
     * Change color scheme
     */
    setColorScheme(schemeName) {
        this.currentColorScheme = schemeName;
        console.log(`Color scheme changed to: ${schemeName}`);
    }
    
    /**
     * Set bass boost multiplier
     */
    setBassBoost(value) {
        this.bassBoost = parseFloat(value);
        console.log(`🔊 Bass boost set to: ${this.bassBoost}x`);
    }
    
    /**
     * Check if visualizer is currently running
     */
    isRunning() {
        return this.isActive;
    }
    
    /**
     * Stop the visualizer and clean up resources
     */
    stop() {
        console.log('⏹️ Stopping audio visualizer');
        
        this.isActive = false;
        
        // Cancel animation loop
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // DON'T stop audio stream - keep it alive for reuse
        // Only disconnect from audio context
        this.audioStream = null;
        
        // Close audio context
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
            this.audioContext = null;
        }
        
        // Reset grid to default
        this.resetGrid();
        
        console.log('✅ Audio visualizer stopped (stream kept alive for reuse)');
    }
    
    /**
     * Reset grid to default GitHub colors
     */
    resetGrid() {
        if (this.rectGrid.length === 0) return;
        
        for (let col = 0; col < this.columns; col++) {
            if (!this.rectGrid[col]) continue;
            for (let row = 0; row < this.rows; row++) {
                const cell = this.rectGrid[col][row];
                if (cell) {
                    // Remove inline style to restore original color
                    cell.style.removeProperty('background-color');
                }
            }
        }
    }
    
    /**
     * Check if visualizer is currently active
     */
    isRunning() {
        return this.isActive;
    }
}

// Export for use in content script
if (typeof window !== 'undefined') {
    window.AudioVisualizer = AudioVisualizer;
}
