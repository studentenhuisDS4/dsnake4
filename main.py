import pygame as pygame
import random as r
import os

from Game import Game
from Map_Objects import *
from Snake import Snake
from Food import Food
from utils.server_client import ServerClient


def redraw_game_window(surface, g, nickname, cc_image):
    surface.fill((0, 0, 0))
    g.map.draw(surface, g)
    drawGrid(g.width, g.columns, g.rows, surface)

    dis = g.width/g.columns

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
        elif f_type == "beer":
            food_eaten = g.font.render(
                "x " + str(g.food_types[f_type]) + "/" + str(g.beer_to_get), False, (255, 255, 255))
        elif f_type == "weed":
            food_eaten = g.font.render(
                "x " + str(g.food_types[f_type]) + "/" + str(g.weed_to_get), False, (255, 255, 255))
        elif f_type == "coffie":
            if g.coffie_lives_obtained < g.coffie_total_lives:
                food_eaten = g.font.render(
                    "x " + str(g.food_types[f_type]) + "/" + str(g.coffie_to_get[g.coffie_lives_obtained]), False, (255, 255, 255))
            else:
                food_eaten = g.font.render(
                    "x " + str(g.food_types[f_type]), False, (255, 255, 255))
            for i in range(g.coffie_lives_obtained-g.coffie_lives_used):
                surface.blit(cc_image, (g.width + 150 + i*30, 80 + counter))

        else:
            food_eaten = g.font.render(
                "x " + str(g.food_types[f_type]), False, (255, 255, 255))
        surface.blit(food_eaten, (g.width + 70, 90 + counter))
        counter += 40

    if g.main_obj_collected != g.main_obj_total:
        next_object = g.font.render(
            "Next Object is in:", False, (255, 255, 255))
        surface.blit(next_object, (g.width + 20, 90 + counter))
        counter += 40
        next_object = g.font.render(
            g.main_obj_locations[g.main_obj_collected], False, (255, 255, 255))
        surface.blit(next_object, (g.width + 20, 90 + counter))

    if g.map.under_effect_of_weed:
        for i in range(g.weed_counter):
            pygame.draw.rect(surface, (255*min(1, 2 - 2*g.weed_counter/g.weed_time_effect), 255*min(1, 2*g.weed_counter/g.weed_time_effect), 0),
                             (i*dis+1, (g.rows - 1)*dis+1, dis-1, dis-1))

    pygame.display.update()


def drawGrid(w, cols, rows, surface):
    sizeBtwn = w // cols

    x = 0
    y = 0
    for c in range(cols):
        x = x + sizeBtwn
        for r in range(rows):
            y = y + sizeBtwn

            pygame.draw.line(surface, (100, 100, 100), (x, 0), (x, w))
            pygame.draw.line(surface, (100, 100, 100), (0, y), (w, y))


def menu(window=None, client=None, g=None, nick="", connected=False):
    (w, h) = (g.width + 250, g.height)
    window = pygame.display.set_mode((w, h))
    font = pygame.font.SysFont('Consolas', 28)
    menu_font = pygame.font.SysFont('Consolas', 60)
    color_inactive = pygame.Color('darkgreen')
    color_active = pygame.Color('green1')
    active = 1

    username = ""
    password = ""
    nickname = ""

    rect_x = w/2 - 156/2

    menu_surface = menu_font.render("MENU", True, color_active)

    menu_x = w/2 - menu_surface.get_width()/2

    play_box = pygame.Rect(rect_x, 100, 156, 32)
    play_color = color_active
    play_surface = font.render("PLAY", True, play_color)
    login_box = pygame.Rect(rect_x, 170, 156, 32)
    login_color = color_inactive
    login_surface = font.render("LOG IN", True, login_color)
    nickname_box = pygame.Rect(rect_x, 240, 156, 32)
    nickname_color = color_inactive
    nickname_surface = font.render("NICKNAME", True, nickname_color)
    quit_box = pygame.Rect(rect_x, 310, 156, 32)
    quit_color = color_inactive
    quit_surface = font.render("QUIT", True, quit_color)

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                exit()
            if event.type == pygame.MOUSEBUTTONDOWN:
                if play_box.collidepoint(event.pos):
                    active = 1
                    play_color = color_active
                    login_color = color_inactive
                    nickname_color = color_inactive
                    quit_color = color_inactive
                    return connected, "play", nickname
                elif login_box.collidepoint(event.pos):
                    active = 2
                    play_color = color_inactive
                    login_color = color_active
                    nickname_color = color_inactive
                    quit_color = color_inactive
                    username, password = get_login(window)
                    if username != 420:
                        connected = connect_server(client, username, password)
                elif nickname_box.collidepoint(event.pos):
                    active = 3
                    play_color = color_inactive
                    login_color = color_inactive
                    nickname_color = color_active
                    quit_color = color_inactive
                    if nickname != "":
                        nickname = get_nickname(window, nickname)
                    else:
                        nickname = get_nickname(window, nick)
                    if nickname == 420:
                        nickname = ""
                elif quit_box.collidepoint(event.pos):
                    active = 4
                    play_color = color_inactive
                    login_color = color_inactive
                    nickname_color = color_inactive
                    quit_color = color_active
                    exit()
                    return connected, "quit", ""
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_RETURN:
                    if active == 1:
                        return connected, "play", nickname
                    elif active == 2:
                        username, password = get_login(window)
                        if username != 420:
                            connected = connect_server(
                                client, username, password)
                    elif active == 3:
                        if nickname != "":
                            nickname = get_nickname(window, nickname)
                        else:
                            nickname = get_nickname(window, nick)
                        if nickname == 420:
                            nickname = ""
                    elif active == 4:
                        exit()
                elif event.key == pygame.K_DOWN:
                    if active == 1:
                        active = 2
                        play_color = color_inactive
                        login_color = color_active
                    elif active == 2:
                        active = 3
                        login_color = color_inactive
                        nickname_color = color_active
                    elif active == 3:
                        active = 4
                        nickname_color = color_inactive
                        quit_color = color_active
                    elif active == 4:
                        active = 1
                        quit_color = color_inactive
                        play_color = color_active
                elif event.key == pygame.K_UP:
                    if active == 1:
                        active = 4
                        play_color = color_inactive
                        quit_color = color_active
                    elif active == 2:
                        active = 1
                        login_color = color_inactive
                        play_color = color_active
                    elif active == 3:
                        active = 2
                        nickname_color = color_inactive
                        login_color = color_active
                    elif active == 4:
                        active = 3
                        quit_color = color_inactive
                        nickname_color = color_active
        window.fill((30, 30, 30))

        play_surface = font.render("PLAY", True, play_color)
        login_surface = font.render("LOG IN", True, login_color)
        nickname_surface = font.render("NICKNAME", True, nickname_color)
        quit_surface = font.render("QUIT", True, quit_color)

        if connected:
            loggedin_success_surface = font.render(
                "Logged in", True, color_active)
        else:
            loggedin_success_surface = font.render(
                "Not logged in", True, color_active)

        if nickname != "":
            playingas_surface = font.render(
                "Playing as: " + nickname, True, color_active)
            window.blit(playingas_surface, (nickname_box.x +
                                            nickname_box.width + 15, nickname_box.y+5))

        window.blit(menu_surface, (menu_x, 20))

        window.blit(play_surface, (play_box.x + play_box.width /
                                   2 - play_surface.get_width()/2, play_box.y+5))
        window.blit(login_surface, (login_box.x + login_box.width /
                                    2 - login_surface.get_width()/2, login_box.y+5))
        window.blit(loggedin_success_surface, (login_box.x +
                                               login_box.width + 15, login_box.y+5))
        window.blit(nickname_surface, (nickname_box.x + nickname_box.width /
                                       2 - nickname_surface.get_width()/2, nickname_box.y+5))
        window.blit(quit_surface, (quit_box.x + quit_box.width /
                                   2 - quit_surface.get_width()/2, quit_box.y+5))

        pygame.draw.rect(window, play_color, play_box, 2)
        pygame.draw.rect(window, login_color, login_box, 2)
        pygame.draw.rect(window, nickname_color, nickname_box, 2)
        pygame.draw.rect(window, quit_color, quit_box, 2)
        pygame.display.flip()
        clock.tick(30)


def get_login(window):
    w, h = pygame.display.get_surface().get_size()
    font = pygame.font.SysFont('Consolas', 28)
    username_box = pygame.Rect(w/2 - 156/2, h/2 - 100, 155, 32)
    password_box = pygame.Rect(w/2 - 156/2, h/2 - 30, 155, 32)
    color_inactive = pygame.Color('darkgreen')
    color_active = pygame.Color('green1')
    username_color = color_active
    password_color = color_inactive
    active = 1
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
                            active = 0
                            password_color = color_inactive
                            username_color = color_inactive
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


def get_nickname(window, nick):
    (w, h) = (g.width + 250, g.height)
    font = pygame.font.SysFont('Consolas', 28)
    input_box = pygame.Rect(w/2 - 320/2, h/2 - 150, 320, 32)
    color_inactive = pygame.Color('green4')
    color_active = pygame.Color('green1')
    color = color_active
    active = True
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

    return nickname


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
        redraw_game_window(window, s, g)
        if paused == False:
            print(paused)


def connect_server(client, *argv):
    success = False
    if len(argv) == 0:
        success = client.authenticate()
    else:
        success = client.authenticate(argv[0], argv[1])
    return success


pygame.init()
pygame.font.init()

g = Game(100, 20)

x = 100
y = 100

os.environ['SDL_VIDEO_WINDOW_POS'] = "%d,%d" % (x, y)

window = pygame.display.set_mode((g.width + 250, g.height))
clock = pygame.time.Clock()


username = ""
password = ""
nickname = ""
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
local_scores_file = open("Local_scores.txt", "a")

connected = False

client = ServerClient()
connected = connect_server(client)

connected, status, nickname = menu(
    window=window, client=client, g=g, nick=temp_nickname, connected=connected)

score = 0
game_ended = False
if status == "quit":
    exit()
elif status == "play":
    coffie_cup_image = pygame.image.load("coffie_cup.png")
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
        redraw_game_window(window, g, nickname, coffie_cup_image)
        if climbed:
            pygame.time.delay(400)
