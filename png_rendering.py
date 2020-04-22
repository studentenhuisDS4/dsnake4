from PIL import Image


def png_rendering(g=None):

    empty_map = Image.open("images/Empty_Map.png")
    pixels = empty_map.load()
    g.current_floor = 0

    for wall in g.map.get_walls_at_floor(g.current_floor, draw=True):
        direction = wall.direction
        for block in range(wall.finish[direction] - wall.start[direction]):
            i = wall.start[0] + (1 - direction)*block
            j = wall.start[1] + direction*block
            if wall.breakable:
                pixels[i,j] = (255,255,255)
            else:
                pixels[i,j] = (255,0,0)


    for stair in g.map.get_stairs_at_floor(g.current_floor):
        for i in range(stair.bottom_right[0] - stair.top_left[0]):
            for j in range(stair.bottom_right[1] - stair.top_left[1]):
                pixels[i+stair.top_left[0],j+stair.top_left[1]] = (0,0,255)

    empty_map.save("Level_1.png")


    empty_map = Image.open("images/Empty_Map.png")
    pixels = empty_map.load()
    g.current_floor = 1

    for wall in g.map.get_walls_at_floor(g.current_floor, draw=True):
        direction = wall.direction
        for block in range(wall.finish[direction] - wall.start[direction]):
            i = wall.start[0] + (1 - direction)*block
            j = wall.start[1] + direction*block
            if wall.breakable:
                pixels[i,j] = (255,255,255)
            else:
                pixels[i,j] = (255,0,0)

    for stair in g.map.get_stairs_at_floor(g.current_floor):
        for i in range(stair.bottom_right[0] - stair.top_left[0]):
            for j in range(stair.bottom_right[1] - stair.top_left[1]):
                pixels[i+stair.top_left[0],j+stair.top_left[1]] = (0,0,255)

    empty_map.save("Level_2.png")

    empty_map = Image.open("images/Empty_Map.png")
    pixels = empty_map.load()
    g.current_floor = 2

    for wall in g.map.get_walls_at_floor(g.current_floor, draw=True):
        direction = wall.direction
        for block in range(wall.finish[direction] - wall.start[direction]):
            i = wall.start[0] + (1 - direction)*block
            j = wall.start[1] + direction*block
            if wall.breakable:
                pixels[i,j] = (255,255,255)
            else:
                pixels[i,j] = (255,0,0)

    for stair in g.map.get_stairs_at_floor(g.current_floor):
        for i in range(stair.bottom_right[0] - stair.top_left[0]):
            for j in range(stair.bottom_right[1] - stair.top_left[1]):
                pixels[i+stair.top_left[0],j+stair.top_left[1]] = (0,0,255)

    empty_map.save("Level_3.png")

    empty_map = Image.open("images/Empty_Map.png")
    pixels = empty_map.load()
    g.current_floor = 3

    for wall in g.map.get_walls_at_floor(g.current_floor, draw=True):
        direction = wall.direction
        for block in range(wall.finish[direction] - wall.start[direction]):
            i = wall.start[0] + (1 - direction)*block
            j = wall.start[1] + direction*block
            if wall.breakable:
                pixels[i,j] = (255,255,255)
            else:
                pixels[i,j] = (255,0,0)

    for stair in g.map.get_stairs_at_floor(g.current_floor):
        for i in range(stair.bottom_right[0] - stair.top_left[0]):
            for j in range(stair.bottom_right[1] - stair.top_left[1]):
                pixels[i+stair.top_left[0],j+stair.top_left[1]] = (0,0,255)

    empty_map.save("Level_Tropen.png")
