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

    def move(self, move_to=None):
        if move_to == None:
            self.body.insert(
                0, (self.body[0][0] + self.dirnx, self.body[0][1] + self.dirny, self.body[0][2]))
        else:
            self.body.insert(0, move_to)

        if self.body[-1] in self.undigested_food:
            self.complete_digestion(self.body[-1])
            self.body[-1]
        else:
            self.body.pop()

    def turn(self, direction=None):
        if type(direction) == type(''):
            if direction == 'LEFT' and self.dirny != 0:
                self.dirnx = -1
                self.dirny = 0
            elif direction == 'RIGHT' and self.dirny != 0:
                self.dirnx = 1
                self.dirny = 0
            elif direction == 'UP' and self.dirnx != 0:
                self.dirnx = 0
                self.dirny = -1
            elif direction == 'DOWN' and self.dirnx != 0:
                self.dirnx = 0
                self.dirny = 1
        else:
            self.dirnx, self.dirny = direction
        return
    
    def reduce(self, l=1):
        blocks_removed = 0
        for i in range(min(len(self.undigested_food), l)):
            self.undigested_food.pop(0)
            blocks_removed += 1
        
        for i in range(min(len(self.body) - 3, l - blocks_removed)):
            self.body.pop()
        return

    def add_undigested_food(self, n_of_blocks=1):
        for i in range(n_of_blocks):
            self.undigested_food.append(self.body[i])

    def self_collision(self):
        if len(list(dict.fromkeys(self.body))) != len(self.body):
            return True
        else:
            return False

    def complete_digestion(self, pos):
        for i in range(len(self.undigested_food)):
            if self.undigested_food[i] == pos:
                self.undigested_food.pop(i)
                return

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
            i = self.body[part][0]
            j = self.body[part][1]
            #pygame.draw.rect(surface, (0,255, 0), (i*dis+1,j*dis+1, dis-2, dis-2))
            if self.body[part][2] == g.current_floor:
                textsurface = self.font.render(letter, False, (0, 255, 0))
                pygame.draw.rect(surface, (0, 0, 0),
                                 (i*dis+1, j*dis+1, dis-1, dis-1))
                surface.blit(textsurface, (i*dis+2, j*dis-1))
