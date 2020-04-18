import pygame as pygame
import random as r
from copy import deepcopy


class Snake(object):
    body = []

    undigested_food = []

    def __init__(self, g):
        for i in range(g.starting_length):
            self.body.append(g.starting_position[i])
        self.dirnx = -1
        self.dirny = 0
        self.font = pygame.font.SysFont('Consolas', 13)

    def move(self, g):
        climbed = False
        
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                # TODO catch exeption if game already quit
                pygame.quit()
                exit()

            keys = pygame.key.get_pressed()

            if (keys[pygame.K_LEFT] or keys[pygame.K_a]) and self.dirny != 0:
                self.dirnx = -1
                self.dirny = 0

            elif (keys[pygame.K_RIGHT] or keys[pygame.K_d]) and self.dirny != 0:
                self.dirnx = 1
                self.dirny = 0

            elif (keys[pygame.K_UP] or keys[pygame.K_w]) and self.dirnx != 0:
                self.dirnx = 0
                self.dirny = -1

            elif (keys[pygame.K_DOWN] or keys[pygame.K_s]) and self.dirnx != 0:
                self.dirnx = 0
                self.dirny = 1
            
            elif keys[pygame.K_SPACE]:
                return climbed, g.points, False, True
            break

        # check for stairs
        climbed, game_ended = self.stair_climbing(g)

        if game_ended:
            return climbed, g.points, True, False

        self.body.insert(
            0, (self.body[0][0] + self.dirnx, self.body[0][1] + self.dirny, self.body[0][2]))

        if self.body[-1] in self.undigested_food:
            self.complete_digestion(self.body[-1])
            self.body[-1]
        else:
            self.body.pop()

        # check for self-collisions
        if len(list(dict.fromkeys(self.body))) != len(self.body):
            if g.use_life():
                pygame.time.delay(500)
                return False, g.points, False, False
            else:
                pygame.time.delay(500)
                return climbed, g.points, True, False

        # check for collisions with walls
        if self.collision_with_walls(g):
            pygame.time.delay(500)
            return climbed, g.points, True, False

        # check if the snake ate food
        self.food_eating(g)

        if g.weed_counter > 0:
            g.reduce_weed_counter()

        return climbed, g.points, False, False

    def food_eating(self, g):
        for f in g.map.food:
            if f.position == self.body[0]:
                g.eating_food(f)
                return

    def stair_climbing(self, g):
        for stair in g.map.get_stairs_at_floor(self.body[0][2]):
            for i in range(stair.bottom_right[0] - stair.top_left[0]):
                for j in range(stair.bottom_right[1] - stair.top_left[1]):
                    if (stair.top_left[0] + i, stair.top_left[1] + j, g.current_floor) == self.body[0]:
                        return True, g.climbing_stairs(stair.identifier)
        return False, False

    def complete_digestion(self, pos):
        for i in range(len(self.undigested_food)):
            if self.undigested_food[i] == pos:
                self.undigested_food.pop(i)
                return

    def collision_with_walls(self, g):
        for wall in g.map.get_walls_at_floor(g.current_floor):
            direction = wall.direction
            for block in range(wall.finish[direction] - wall.start[direction]):
                i = wall.start[0] + (1 - direction)*block
                j = wall.start[1] + direction*block
                if self.body[0] == (i, j, g.current_floor):
                    if g.use_life():
                        pygame.time.delay(500)
                        return False
                    else:
                        pygame.time.delay(500)
                        return True
                    return True
        return False

    def reset(self, g):
        self.body = []
        for i in range(g.starting_length):
            self.body.append(g.starting_position[i])
        self.dirnx = -1
        self.dirny = 0
        self.undigested_food = []

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
            if self.body[part][2] == g.current_floor:
                surface.blit(textsurface, (i*dis+2, j*dis-1))
