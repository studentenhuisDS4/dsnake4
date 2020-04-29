from Map_Objects import *
from Map import Map
import json

level_name = "Shop"
floor = 4

level_map = Map()

walls = []
stairs = []

for w in level_map.get_walls_at_floor(floor):
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

with open('dsnake4-python/json_data/' + level_name + '.json', 'w') as outfile:
    json.dump({"walls": walls, "stairs": stairs}, outfile)
