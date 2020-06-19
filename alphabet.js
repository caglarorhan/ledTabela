const alphabet = {
    "A": [
        [
            0,
            6
        ],
        [
            0,
            5
        ],
        [
            0,
            4
        ],
        [
            0,
            3
        ],
        [
            0,
            2
        ],
        [
            1,
            1
        ],
        [
            2,
            0
        ],
        [
            3,
            1
        ],
        [
            4,
            2
        ],
        [
            4,
            3
        ],
        [
            4,
            4
        ],
        [
            4,
            5
        ],
        [
            4,
            6
        ],
        [
            3,
            3
        ],
        [
            2,
            3
        ],
        [
            1,
            3
        ]
    ],
    "B": [
        [
            0,
            0
        ],
        [
            0,
            1
        ],
        [
            0,
            2
        ],
        [
            0,
            3
        ],
        [
            0,
            4
        ],
        [
            0,
            5
        ],
        [
            0,
            6
        ],
        [
            1,
            6
        ],
        [
            2,
            6
        ],
        [
            3,
            5
        ],
        [
            3,
            4
        ],
        [
            2,
            3
        ],
        [
            1,
            3
        ],
        [
            3,
            2
        ],
        [
            3,
            1
        ],
        [
            2,
            0
        ],
        [
            1,
            0
        ]
    ],
    "C": [
        [
            0,
            2
        ],
        [
            0,
            3
        ],
        [
            0,
            4
        ],
        [
            1,
            1
        ],
        [
            1,
            5
        ],
        [
            2,
            0
        ],
        [
            2,
            6
        ],
        [
            3,
            0
        ],
        [
            3,
            6
        ],
        [
            4,
            0
        ],
        [
            4,
            6
        ]
    ],
    "D": [
        [
            0,
            6
        ],
        [
            0,
            5
        ],
        [
            0,
            4
        ],
        [
            0,
            3
        ],
        [
            0,
            2
        ],
        [
            0,
            1
        ],
        [
            0,
            0
        ],
        [
            1,
            0
        ],
        [
            2,
            0
        ],
        [
            3,
            1
        ],
        [
            4,
            2
        ],
        [
            4,
            3
        ],
        [
            4,
            4
        ],
        [
            3,
            5
        ],
        [
            2,
            6
        ],
        [
            1,
            6
        ]
    ],
    "E": [
        [
            0,
            6
        ],
        [
            0,
            5
        ],
        [
            0,
            4
        ],
        [
            0,
            3
        ],
        [
            0,
            2
        ],
        [
            0,
            1
        ],
        [
            0,
            0
        ],
        [
            1,
            0
        ],
        [
            2,
            0
        ],
        [
            3,
            0
        ],
        [
            1,
            6
        ],
        [
            2,
            6
        ],
        [
            3,
            6
        ],
        [
            1,
            3
        ],
        [
            2,
            3
        ],
        [
            3,
            3
        ]
    ],
    "F": [
        [
            0,
            6
        ],
        [
            0,
            5
        ],
        [
            0,
            4
        ],
        [
            0,
            3
        ],
        [
            0,
            2
        ],
        [
            0,
            1
        ],
        [
            0,
            0
        ],
        [
            1,
            0
        ],
        [
            2,
            0
        ],
        [
            3,
            0
        ],
        [
            1,
            3
        ],
        [
            2,
            3
        ],
        [
            3,
            3
        ]
    ],
    "G": [
        [
            2,
            6
        ],
        [
            3,
            6
        ],
        [
            1,
            5
        ],
        [
            0,
            4
        ],
        [
            0,
            3
        ],
        [
            0,
            2
        ],
        [
            1,
            1
        ],
        [
            2,
            0
        ],
        [
            3,
            0
        ],
        [
            4,
            1
        ],
        [
            4,
            2
        ],
        [
            4,
            5
        ],
        [
            4,
            4
        ],
        [
            3,
            4
        ],
        [
            2,
            4
        ]
    ],
    "H": [[0, 6], [0, 5], [0, 4], [0, 3], [0, 2], [0, 1], [0, 0], [4, 6], [4, 5], [4, 4], [4, 3], [4, 2], [4, 1], [4, 0], [3, 3], [2, 3], [1, 3]],
    "I": [[0, 6], [1, 6], [2, 6], [1, 5], [1, 4], [1, 3], [1, 2], [1, 1], [1, 0], [0, 0], [2, 0]],
    "J": [[2, 0], [3, 0], [4, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [2, 6], [1, 6], [0, 5], [0, 4]],
    "K": [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 3], [2, 2], [3, 1], [3, 0], [2, 4], [3, 5], [3, 6]],
    "L": [[0, 6], [0, 5], [0, 4], [0, 3], [0, 2], [0, 1], [0, 0], [1, 6], [2, 6], [3, 6]],
    "M": [[4, 6], [4, 5], [4, 4], [4, 3], [4, 2], [4, 1], [4, 0], [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [3, 1], [1, 1], [2, 2], [2, 3]],
    "N": [[0, 6], [0, 5], [0, 4], [0, 3], [0, 2], [0, 1], [0, 0], [1, 1], [2, 2], [2, 3], [3, 4], [3, 5], [4, 6], [4, 5], [4, 4], [4, 3], [4, 2], [4, 1], [4, 0]],
    "O": [[3, 6], [2, 6], [1, 5], [0, 4], [4, 5], [5, 4], [5, 3], [5, 2], [0, 3], [0, 2], [1, 1], [2, 0], [3, 0], [4, 1], [5, 2]],
    "Q": [[2,6],[3,6],[1,5],[0,4],[0,3],[0,2],[1,1],[2,0],[3,0],[4,1],[5,2],[5,3],[5,4],[4,5],[5,6]],
    "P": [[0, 6], [0, 5], [0, 4], [0, 3], [0, 2], [0, 1], [0, 0], [1, 0], [2, 0], [3, 1], [3, 2], [2, 3], [1, 3]],
    "R": [[0, 6], [0, 5], [0, 4], [0, 3], [0, 2], [0, 1], [0, 0], [1, 0], [2, 0], [3, 1], [3, 2], [2, 3], [1, 3], [2, 4], [3, 5], [3, 6]],
    "S": [[3, 0], [2, 0], [1, 0], [0, 0], [0, 1], [0, 2], [0, 3], [1, 3], [2, 3], [3, 3], [3, 4], [3, 5], [3, 6], [2, 6], [1, 6], [0, 6]],
    "T": [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6]],
    "U": [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 6], [2, 6], [3, 6], [4, 5], [4, 4], [4, 3], [4, 2], [4, 1], [4, 0]],
    "V": [[0, 0], [0, 1], [1, 2], [1, 3], [2, 4], [2, 5], [3, 6], [4, 5], [4, 4], [5, 3], [5, 2], [6, 1], [6, 0]],
    "W": [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 6], [2, 6], [3, 6], [4, 5], [4, 4], [4, 3], [4, 2], [4, 1], [4, 0], [2, 5], [2, 4], [2, 3]],
    "X": [[0, 6], [0, 5], [1, 4], [2, 3], [3, 3], [4, 4], [5, 5], [5, 6], [4, 2], [5, 1], [5, 0], [0, 0], [0, 1], [1, 2], [2, 3]],
    "Y": [[0, 0], [0, 1], [1, 2], [2, 3], [3, 2], [4, 1], [4, 0], [2, 4], [2, 5], [2, 6]],
    "Z": [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [4, 1], [3, 2], [2, 3], [1, 4], [0, 5], [0, 6], [1, 6], [2, 6], [3, 6], [4, 6]],
    " ": []
};

