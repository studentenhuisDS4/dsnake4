from Map_Objects import *
from Map import Map
import json

level_names = ['Level0', 'Level1', 'Level2', 'Level4Tropen', 'Level3Shop']

for i in range(5):
    level_name = level_names[i]
    floor = i

    level_map = Map()
    walls = []
    stairs = []

    for w in level_map.get_walls_at_floor(floor):
        if w.breakable:
            direction = 'Down'
            if w.direction == 0:
                direction = 'Right'

            walls.append({
                "position": {
                    "x": w.start[0] + 1,
                    "y": w.start[1] + 1
                },
                "direction": direction,
                "removable": w.breakable,
                "length": w.length,
                "visible": True
            })

    for w in level_map.get_walls_at_floor(floor):
        if not w.breakable:
            direction = 'Down'
            if w.direction == 0:
                direction = 'Right'

            walls.append({
                "position": {
                    "x": w.start[0] + 1,
                    "y": w.start[1] + 1
                },
                "direction": direction,
                "removable": w.breakable,
                "length": w.length,
                "visible": True
            })

    for s in level_map.get_stairs_at_floor(floor):
        if s.direction == (0, 1):
            direction = 'Down'
        elif s.direction == (0, -1):
            direction = 'Up'
        elif s.direction == (1, 0):
            direction = 'Right'
        elif s.direction == (-1, 0):
            direction = 'Left'

        stairs.append({
            "position": {
                "x": s.top_left[0] + 1,
                "y": s.top_left[1] + 1
            },
            "exitDirection": direction,
            "width": s.width,
            "height": s.height,
            "identifier": str(s.identifier)
        })

    with open('dsnake4-phaser/src/assets/static_levels/' + level_name + '.json', 'w') as outfile:
        json.dump({"walls": walls, "stairs": stairs}, outfile)
