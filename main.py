import pygame as pygame
import random as r


class game(object):
    starting_length = 0
    starting_position = []
    s = None
    current_floor = 0
    number_of_floors = 2

    def __init__(self, s_x, s_y):
        self.starting_length = 3
        for i in range(self.starting_length):
            self.starting_position.append((s_x, s_y + i, self.current_floor))

        self.width = 1050
        self.height = 600
        self.columns = 105
        self.rows = 60

        self.keys_used = [0]

        self.font = pygame.font.SysFont('Consolas', 20)
        self.food_types = {"coffie": 0, "beer": 0, "weed": 0, "krant": 0}
        self.food_colors = {"coffie": (154, 86, 27), "beer": (255, 255, 20), "weed": (70, 200, 0), "krant": (200, 200, 200)}

        self.points = 0
        self.s = snake(self)
        self.map = map(self,self.current_floor)

    def eating_food(self, f_type):
        self.food_types[f_type] += 1

        if self.food_types["krant"] == 5 and self.keys_used[0] == 0:
            self.keys_used[0] = 1
            self.map.walls[0].pop()
            print("Tropen Door OPENED!")

    def reset(self, s_x, s_y):
        self.current_floor = 0
        self.starting_length = 3
        for i in range(self.starting_length):
            self.starting_position.append((s_x, s_y + i, self.current_floor))

        for i in list(self.food_types.keys()):
            self.food_types[i] = 0

        self.keys_used = [0]*len(self.keys_used)
        self.map = map(self,self.current_floor)
        self.points = 0
        self.s.reset()
        self.map.reset(self)


class map(object):
    walls = [[],[]]
    stairs = [[],[]]
    food = []
    floor = 1
    def __init__(self, g, f = 1):
        self.floor = f
        self.init_first_floor()
        self.init_second_floor()
        self.init_food(g)

    def init_first_floor(self):
        self.walls[0] = []
        #contour walls
        self.walls[0].append([(0, 0), (104, 0), 0])
        self.walls[0].append([(104, 0), (104, 60), 1])
        self.walls[0].append([(0, 59), (104, 59), 0])
        self.walls[0].append([(0, 0), (0, 59), 1])

        self.walls[0].append([(0, 10), (12, 10), 0])
        self.walls[0].append([(19, 10), (30, 10), 0])
        self.walls[0].append([(30, 0), (30, 6), 1])
        self.walls[0].append([(30, 7), (30, 11), 1])
        self.walls[0].append([(0, 30), (30, 30), 0])
        self.walls[0].append([(33, 30), (48, 30), 0])
        self.walls[0].append([(52, 30), (64, 30), 0])
        self.walls[0].append([(68, 30), (80, 30), 0])
        self.walls[0].append([(85, 30), (90, 30), 0])
        self.walls[0].append([(90, 25), (90, 40), 1])
        self.walls[0].append([(90, 45), (90, 60), 1])
        self.walls[0].append([(93, 42), (104, 42), 0])
        self.walls[0].append([(75,30), (75, 56), 1])
        self.walls[0].append([(75,57), (75, 60), 1])
        self.walls[0].append([(90, 25), (95, 25), 0])
        self.walls[0].append([(98, 25), (104, 25), 0])
        self.walls[0].append([(45, 30), (45, 37), 1])
        self.walls[0].append([(45, 41), (45, 49), 1])
        self.walls[0].append([(45, 54), (45, 60), 1])
        self.walls[0].append([(0, 45), (21, 45), 0])
        self.walls[0].append([(25, 45), (45, 45), 0])
        self.walls[0].append([(20, 45), (20, 50), 1])
        self.walls[0].append([(20, 54), (20, 60), 1])
        self.walls[0].append([(25, 30), (25, 45), 1])

        self.walls[0].append([(12, 10), (19, 10), 0])
    def init_second_floor(self):
        self.walls[1] = []
        #contour walls
        self.walls[1].append([(0, 0), (104, 0), 0])
        self.walls[1].append([(104, 0), (104, 60), 1])
        self.walls[1].append([(0, 59), (104, 59), 0])
        self.walls[1].append([(0, 0), (0, 59), 1])

        self.walls[1].append([(0, 50), (4, 50), 0])
        self.walls[1].append([(7, 50), (35, 50), 0])
        self.walls[1].append([(39, 50), (57, 50), 0])
        self.walls[1].append([(64, 50), (78, 50), 0])
        self.walls[1].append([(80, 50), (95, 50), 0])
        self.walls[1].append([(98, 50), (104, 50), 0])

        self.walls[1].append([(0, 30), (7, 30), 0])
        self.walls[1].append([(11, 30), (33, 30), 0])
        self.walls[1].append([(37, 30), (40, 30), 0])
        self.walls[1].append([(19, 30), (19, 50), 1])

        self.walls[1].append([(0, 20), (7, 20), 0])
        self.walls[1].append([(11, 20), (15, 20), 0])
        self.walls[1].append([(15, 16), (30, 16), 0])
        self.walls[1].append([(15, 2), (15, 21), 1])
        self.walls[1].append([(30, 0), (30, 9), 1])
        self.walls[1].append([(30, 13), (30, 17), 1])
        self.walls[1].append([(40, 0), (40, 5), 1])
        self.walls[1].append([(40, 9), (40, 19), 1])
        self.walls[1].append([(40, 25), (40, 50), 1])
        self.walls[1].append([(70, 0), (70, 18), 1])

        self.walls[1].append([(70, 15), (74, 15), 0])
        self.walls[1].append([(79, 15), (104, 15), 0])
        self.walls[1].append([(70, 23), (70, 50), 1])
        
        self.walls[1].append([(70, 30), (74, 30), 0])
        self.walls[1].append([(78, 30), (95, 30), 0])
        self.walls[1].append([(99, 30), (104, 30), 0])
        self.walls[1].append([(88, 30), (88, 50), 1])
    def init_stairs(self):
        self.stairs = [[],[]]

        self.stairs[0].append([(42,27),(44,29),0])

    def init_food(self, g):
        self.food = []
        self.add_random_food(g, "coffie",0)
        self.add_random_food(g, "beer", 0)
        self.add_random_food(g, "weed", 0)
        self.add_random_food(g, "krant", 0)

    def add_random_food(self, g, *argv):
        not_legal = True
        if len(argv) == 0:
            f_type = list(g.food_types.keys())[r.randint(0, len(g.food_types)-1)]
            floor = r.randint(0, g.number_of_floors-1)
            print(floor)
        elif len(argv) == 1 and type(argv) == type(""):
            f_type = argv
        elif len(argv) == 1 and type(argv) == type(1):
            floor = argv
        else:
            f_type = argv[0]
            floor = argv[1]
            
        while not_legal:
            row = r.randint(0, g.rows-1)
            col = r.randint(0, g.columns-1)
            not_legal = self.is_food_not_legal(g, (col, row))
        self.add_food(food(f_type, (col, row, floor), g))

    def is_food_not_legal(self, g, pos):
        for wall in self.walls[g.current_floor]:
            direction = wall[2]
            for block in range(wall[1][direction] - wall[0][direction]):
                i = wall[0][0] + (1 - direction)*block
                j = wall[0][1] + direction*block
                if (i, j) == pos:
                    return True
        for f in self.food:
            if f.position == pos:
                return True
        for snake_block in g.s.body:
            if snake_block == pos:
                return True
        return False

    def add_food(self, f):
        self.food.append(f)

    def remove_food(self, g, pos):
        self.add_random_food(g)
        for i in range(len(self.food)):
            if pos == self.food[i].position:
                self.food.pop(i)
                return

    def reset(self, g):
        self.init_first_floor()
        self.init_second_floor()
        self.init_food(g)

    def draw(self, surface, g):
        dis = g.width/g.columns

        for wall in self.walls[g.current_floor]:
            direction = wall[2]
            for block in range(wall[1][direction] - wall[0][direction]):
                i = wall[0][0] + (1 - direction)*block
                j = wall[0][1] + direction*block
                pygame.draw.rect(surface, (255, 255, 255),
                                 (i*dis+1, j*dis+1, dis-1, dis-1))

        for f in self.food:
            i = f.position[0]
            j = f.position[1]
            if f.position[2] == g.current_floor:
                pygame.draw.rect(surface, f.color, (i*dis+1, j*dis+1, dis-1, dis-1))
        
        for stair in self.stairs[g.current_floor]:
            for i in range(stair[1][0] - stair[0][0]):
                for j in range(stair[1][1] - stair[0][1]):
                    pygame.draw.rect(surface, (14, 37, 255), ((i+stair[0][0])*dis+1, (j+stair[0][1])*dis+1, dis-1, dis-1))


class food(object):
    food_type = ""
    points = 0
    block_parts = 0
    position = (0, 0, 0)

    def __init__(self, food_type, pos, g):
        self.food_type = food_type
        self.position = pos
        self.color = g.food_colors[food_type]

        if food_type == "coffie":
            self.points = 20
            self.block_parts = 1
        elif food_type == "beer":
            self.points = 10
            self.block_parts = 2
        elif food_type == "weed":
            self.points = 10
            self.block_parts = 1
        elif food_type == "krant":
            self.points = -5
            self.block_parts = 0


class snake(object):
    body = []
    turns = {}

    undigested_food = []

    def __init__(self, g):
        for i in range(g.starting_length):
            self.body.append(g.starting_position[i])
        self.dirnx = 0
        self.dirny = -1
        self.font = pygame.font.SysFont('Consolas', 13)

    def move(self, g):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()

            keys = pygame.key.get_pressed()
            for key in keys:
                if keys[pygame.K_LEFT] and self.dirny != 0:
                    self.dirnx = -1
                    self.dirny = 0
                    self.turns[self.body[0]] = [self.dirnx, self.dirny, self.body[0][2]]

                elif keys[pygame.K_RIGHT] and self.dirny != 0:
                    self.dirnx = 1
                    self.dirny = 0
                    self.turns[self.body[0]] = [self.dirnx, self.dirny, self.body[0][2]]

                elif keys[pygame.K_UP] and self.dirnx != 0:
                    self.dirnx = 0
                    self.dirny = -1
                    self.turns[self.body[0]] = [self.dirnx, self.dirny, self.body[0][2]]

                elif keys[pygame.K_DOWN] and self.dirnx != 0:
                    self.dirnx = 0
                    self.dirny = 1
                    self.turns[self.body[0]] = [self.dirnx, self.dirny, self.body[0][2]]
        
        #check for stairs
        #TODO

        self.body.insert(0, (self.body[0][0] + self.dirnx, self.body[0][1] + self.dirny, self.body[0][2]))

        if self.body[-1] in self.undigested_food:
            self.complete_digestion(self.body[-1])
            last_pos = self.body[-1]
        else:
            last_pos = self.body.pop()

        if last_pos in self.turns:
            self.turns.pop(last_pos)
        # print(self.body)

        # check for self-collisions
        if len(list(dict.fromkeys(self.body))) != len(self.body):
            pygame.time.delay(500)
            g.reset(50, 20)

        # check for collisions with walls
        if self.collision_with_walls(g):
            pygame.time.delay(500)
            g.reset(50, 20)

        # check if the snake ate food
        self.food_eating(g)

    def food_eating(self, g):
        for f in g.map.food:
            if f.position == self.body[0]:
                g.eating_food(f.food_type)
                g.map.remove_food(g, f.position)
                g.points += f.points
                for i in range(min(f.block_parts, len(self.body))):
                #for i in range(len(self.body)):
                    self.undigested_food[0].append(self.body[i])
                    self.undigested_food[1].append(g.current_floor)


    def complete_digestion(self, pos):
        for i in range(len(self.undigested_food)):
            if self.undigested_food[i] == pos:
                self.undigested_food[0].pop(i)
                self.undigested_food[1].pop(i)
                return

    def collision_with_walls(self, g):
        for wall in g.map.walls[g.current_floor]:
            direction = wall[2]
            for block in range(wall[1][direction] - wall[0][direction]):
                i = wall[0][0] + (1 - direction)*block
                j = wall[0][1] + direction*block
                if self.body[0] == (i, j, g.current_floor):
                    return True
        return False

    def reset(self, g):
        self.body = g.starting_position
        self.turns = {}
        self.dirnx = 0
        self.dirny = -1

    def draw(self, surface, g):
        dis = g.width/g.columns
        for part in range(len(self.body)):
            letter = ''
            if part == 0:
                letter = 'D'
            elif part == len(self.body)-1:
                letter = '4'
            else:
                letter = 'S'
            textsurface = self.font.render(letter, False, (0, 255, 0))
            i = self.body[part][0]
            j = self.body[part][1]
            #pygame.draw.rect(surface, (0,255, 0), (i*dis+1,j*dis+1, dis-2, dis-2))
            surface.blit(textsurface, (i*dis+2, j*dis-1))


def redrawWindow(surface, g):
    surface.fill((0, 0, 0))
    g.s.draw(surface, g)
    g.map.draw(surface, g)
    drawGrid(g.width, g.columns, surface)

    points = g.font.render(str(g.points), False, (255, 255, 255))
    surface.blit(points, (g.width + 30, 10))
    counter = 0
    for f_type in g.food_types:
        pygame.draw.rect(surface, g.food_colors[f_type], (g.width + 30, (55+counter), 25, 25))
        food_eaten = g.font.render("x " + str(g.food_types[f_type]), False, (255, 255, 255))
        surface.blit(food_eaten, (g.width + 70, 60 + counter))
        counter += 40

    pygame.display.update()


def drawGrid(w, cols, surface):
    sizeBtwn = w // cols

    x = 0
    y = 0
    for l in range(cols):
        x = x + sizeBtwn
        y = y + sizeBtwn

        pygame.draw.line(surface, (100, 100, 100), (x, 0), (x, w))
        pygame.draw.line(surface, (100, 100, 100), (0, y), (w, y))

# Epic Fail


def pause(s, g):
    paused = True
    while paused:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()

            keys = pygame.key.get_pressed()

            for key in keys:
                if keys[pygame.K_q]:
                    paused = False
        clock.tick(5)
        redrawWindow(window, s, g)
        if paused == False:
            print(paused)


pygame.font.init()

g = game(50, 20)

window = pygame.display.set_mode((g.width + 200, g.height))
clock = pygame.time.Clock()

while True:
    pygame.time.delay(50)
    clock.tick(15)
    g.s.move(g)
    redrawWindow(window, g)
    print(g.s.body)
