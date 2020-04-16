import pygame as pygame
import random as r
import os

from Game import Game
from Map_Objects import *
from Snake import Snake
from Food import Food
#from utils.server_client import ServerClient

#from utils.server_client import ServerClient

def redrawWindow(surface, g, nickname):
    surface.fill((0, 0, 0))
    g.map.draw(surface, g)
    drawGrid(g.width, g.columns, surface)

    nick = g.font.render(nickname, False, (255, 255, 255))
    surface.blit(nick, (g.width + 30, 10))

    points = g.font.render(str(g.points), False, (255, 255, 255))
    surface.blit(points, (g.width + 30, 40))
    counter = 0

    for f_type in g.food_types:
        pygame.draw.rect(
            surface, g.food_colors[f_type], (g.width + 30, 85 + counter, 25, 25))
        if f_type == "main_obj":
            food_eaten = g.font.render(
                "x " + str(g.food_types[f_type]) + "/" + str(g.main_obj_total), False, (255, 255, 255))
        elif f_type == "krant":
            food_eaten = g.font.render(
                "x " + str(g.food_types[f_type]) + "/" + str(g.krant_to_get), False, (255, 255, 255))
        else:
            food_eaten = g.font.render(
                "x " + str(g.food_types[f_type]), False, (255, 255, 255))
        surface.blit(food_eaten, (g.width + 70, 90 + counter))
        counter += 40

    if g.main_obj_collected != g.main_obj_total:
        next_object = g.font.render("Next Object is in:", False, (255, 255, 255))
        surface.blit(next_object, (g.width + 20, 90 + counter))
        counter += 40
        next_object = g.font.render(g.main_obj_locations[g.main_obj_collected], False, (255, 255, 255))
        surface.blit(next_object, (g.width + 20, 90 + counter))


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


def connect_server():
    client = ServerClient()
    # Login with credentials, auto-saves pickle file with token. DONT SAVE THIS STEP TO GIT.
    client.authenticate(username="Andrea", password="Andrea")
    # Login by loading pickle file, no-brainer and quite neat.
    client.authenticate()
    return client


#client = connect_server()
#print("Highscores: ", client.load_highscores())

#https://github.com/studentenhuisDS4/ds4reboot/blob/develop/user/api/serializers/snake_highscore.py

x = 500
y = 200

os.environ['SDL_VIDEO_WINDOW_POS'] = "%d,%d" % (x,y)

pygame.font.init()

g = Game(100, 20)
clock = pygame.time.Clock()

window = pygame.display.set_mode((280, 100))
font = pygame.font.Font(None, 32)
clock = pygame.time.Clock()
input_box = pygame.Rect(30, 50, 155, 32)
color_inactive = pygame.Color('lightskyblue3')
color_active = pygame.Color('dodgerblue2')
color = color_inactive
active = False
nickname = ''
done = False

while not done:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            done = True
        if event.type == pygame.MOUSEBUTTONDOWN:
            # If the user clicked on the input_box rect.
            if input_box.collidepoint(event.pos):
                # Toggle the active variable.
                active = not active
            else:
                active = False
            # Change the current color of the input box.
            color = color_active if active else color_inactive
        if event.type == pygame.KEYDOWN:
            if active:
                if event.key == pygame.K_RETURN:
                    done = True
                elif event.key == pygame.K_BACKSPACE:
                    nickname = nickname[:-1]
                else:
                    nickname += event.unicode

    window.fill((30, 30, 30))
    # Render the current text.
    txt_surface = font.render(nickname, True, color)
    # Resize the box if the text is too long.
    width = max(200, txt_surface.get_width()+10)
    input_box.w = width
    # Blit the text.
    window.blit(txt_surface, (input_box.x+5, input_box.y+5))
    # Blit the input_box rect.
    exp_text = g.font.render("Nickname:", False, (255, 255, 255))
    window.blit(exp_text, (input_box.x, input_box.y - 30))
    pygame.draw.rect(window, color, input_box, 2)

    pygame.display.flip()
    clock.tick(30)

x = 100
y = 100

os.environ['SDL_VIDEO_WINDOW_POS'] = "%d,%d" % (x,y)

window = pygame.display.set_mode((g.width + 250, g.height))

while True:
    pygame.time.delay(50)
    clock.tick(15)
    climbed = g.s.move(g)
    redrawWindow(window, g, nickname)
    if climbed:
        pygame.time.delay(400)

    #print(g.s.body)
