from Map_Objects import *
import json

level_name = "Shop"
floor = 4

level_map = Map()

walls = []
stairs = [{}]

for w in level_map.get_walls_at_floor(floor):
    direction = 'Down'
    if w.direction == 0:
        direction = 'Right'

    walls.append({
        "position": {
            "x": w.start[0],
            "y": w.start[1]
        },
        "direction": direction,
        "removable": w.breakable,
        "length": w.length,
        "visible": True
    })

with open(level_name + '.json', 'w') as outfile:
    json.dump({"walls": walls, "stairs": stairs}, outfile)
