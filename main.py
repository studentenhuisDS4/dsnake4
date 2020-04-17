import pygame as pygame
import random as r
import os

from Game import Game
from Map_Objects import *
from Snake import Snake
from Food import Food
from utils.server_client import ServerClient

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
def get_login():
    window = pygame.display.set_mode((280, 300))
    font = pygame.font.SysFont('Consolas', 28)
    username_box = pygame.Rect(30, 50, 155, 32)
    password_box = pygame.Rect(30, 120, 155, 32)
    color_inactive = pygame.Color('lightskyblue3')
    color_active = pygame.Color('dodgerblue2')
    username_color = color_inactive
    password_color = color_inactive
    active = 0
    username = ''
    password = ''
    done = False

    while not done:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                done = True
                return 420, 420
            if event.type == pygame.MOUSEBUTTONDOWN:
                if username_box.collidepoint(event.pos):
                    if active != 1:
                        active = 1
                        username_color = color_active
                        password_color = color_inactive
                    else:
                        active = 0
                        username_color = color_inactive
                elif password_box.collidepoint(event.pos):
                    if active != 2:
                        active = 2
                        password_color = color_active
                        username_color = color_inactive
                    else:
                        active = 0
                        password_color = color_inactive
                # Change the current color of the input box.
            if event.type == pygame.KEYDOWN:
                if active != 0:
                    if event.key == pygame.K_TAB:
                        if active == 1:
                            active = 2
                            password_color = color_active
                            username_color = color_inactive
                        elif active == 2:
                            active = 1
                            password_color = color_inactive
                            username_color = color_active
                    elif event.key == pygame.K_RETURN:
                        if active == 1:
                            active = 2
                            password_color = color_active
                            username_color = color_inactive
                        elif username != "" and password != "":
                            done = True
                        else:
                            print("Error: Username or Password not inserted")

                    elif event.key == pygame.K_BACKSPACE:
                        if active == 1:
                            username = username[:-1]
                        elif active == 2:
                            password = password[:-1]
                    else:
                        if active == 1:
                            username += event.unicode
                        elif active == 2:
                            password += event.unicode

        window.fill((30, 30, 30))
        # Render the current text.
        username_surface = font.render(username, True, username_color)
        password_surface = font.render("*"*len(password), True, password_color)
        # Resize the box if the text is too long.
        width_username = max(200, username_surface.get_width()+10)
        width_password = max(200, password_surface.get_width()+10)
        username_box.w = width_username
        password_box.w = width_password
        # Blit the text.
        window.blit(username_surface, (username_box.x+5, username_box.y+5))
        window.blit(password_surface, (password_box.x+5, password_box.y+5))
        # Blit the input_box rect.
        exp_text = g.font.render("Username:", False, (255, 255, 255))
        window.blit(exp_text, (username_box.x, username_box.y - 30))
        exp_text = g.font.render("Password:", False, (255, 255, 255))
        window.blit(exp_text, (password_box.x, password_box.y - 30))
        pygame.draw.rect(window, username_color, username_box, 2)
        pygame.draw.rect(window, password_color, password_box, 2)

        pygame.display.flip()
        clock.tick(30)
    return username, password
def get_nickname(nick):
    window = pygame.display.set_mode((325, 100))
    font = pygame.font.SysFont('Consolas', 28)
    input_box = pygame.Rect(30, 50, 320, 32)
    color_inactive = pygame.Color('lightskyblue3')
    color_active = pygame.Color('dodgerblue2')
    color = color_inactive
    active = False
    nickname = nick
    done = False

    while not done:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                done = True
                return 420
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
                        if nickname != "":
                            done = True
                        else:
                            #Maybe give an error
                            print("Error")

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

    return nickname

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


def connect_server(client, *argv):
    success = False
    if len(argv) == 0:
        success = client.authenticate()
    else:
        success = client.authenticate(argv[0], argv[1])
    return success

x = 500
y = 200

os.environ['SDL_VIDEO_WINDOW_POS'] = "%d,%d" % (x,y)

pygame.init()
pygame.font.init()

g = Game(100, 20)
clock = pygame.time.Clock()


username = ""
password = ""
nickname = ""

connected = False


client = ServerClient()
connected = connect_server(client)

if not connected:
    while username == "" or password == "":
        username, password = get_login()
        if username == 420:
            exit()
    connected = connect_server(client, username, password)

temp_nickname = ""
local_scores_read = None
try: 
    local_scores_read = open("Local_scores.txt", "r")
    first_line = local_scores_read.readline()
    w = first_line.split()
    w.pop()
    temp_nickname = ' '.join(w)
    local_scores_read.close()
except:
    local_scores_read = None


while nickname == "":
    nickname = get_nickname(temp_nickname)
    if nickname == 420:
        exit()

local_scores_file = open("Local_scores.txt", "a")

x = 100
y = 100

os.environ['SDL_VIDEO_WINDOW_POS'] = "%d,%d" % (x,y)

window = pygame.display.set_mode((g.width + 250, g.height))

score = 0
game_ended = False

while True:
    pygame.time.delay(50)
    clock.tick(15)
    climbed, score, game_ended = g.s.move(g)
    if game_ended:
        g.reset(100, 20)
        if connected:
            client.add_highscore(nickname, score)
        local_scores_file.write(nickname + " " + str(score) + "\n")
        score = 0
        game_ended = False
    redrawWindow(window, g, nickname)
    if climbed:
        pygame.time.delay(400)

    #print(g.s.body)
