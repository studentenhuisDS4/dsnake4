import pygame as pygame
from pygame.sprite import Sprite
import random as r
import os

from Game import Game
from Map_Objects import *
from Snake import Snake
from Food import Food
from utils.server_client import ServerClient

class Main_Objects(Sprite):
    def __init__(self):
        Sprite.__init__(self)
        self.image = pygame.Surface((50, 50))
        self.image.fill((0,0,0))
        self.rect = self.image.get_rect()



def redraw_game_window(surface, g, nickname, images=[]):
    surface.fill((0, 0, 0))
    g.map.draw(surface, g)
    drawGrid(g.width, g.columns, g.rows, surface)

    text_color = pygame.Color('green1')

    dis = g.width/g.columns

    nick = g.font.render(nickname, False, text_color)
    surface.blit(nick, (g.width + 30, 10))

    points = g.font.render(str(g.points) + " points", False, text_color)
    surface.blit(points, (g.width + 30, 40))
    counter = 0

    if g.current_floor == 2:
        surface.blit(images[12], (861, 431))
    for f_type in g.food_types:
        if f_type == "main_obj":
            pygame.draw.rect(
                surface, g.food_colors[f_type], (g.width + 30, 85 + counter, 25, 25))
            food_eaten = g.font.render(
                "x " + str(g.food_types[f_type]) + "/" + str(g.main_obj_total), False, (255, 255, 255))
            surface.blit(food_eaten, (g.width + 70, 90 + counter))
        elif f_type == "krant":
            if g.krant_to_get > 6:
                krant_in_a_line = int(g.krant_to_get / 2)
                line = 0
                for i in range(g.krant_to_get):
                    line = int(i / krant_in_a_line)
                    if i < g.food_types["krant"]:
                        surface.blit(
                            images[3], (g.width + 30 + (i - line*(krant_in_a_line))*25, 74 + counter + 16*line))
                    else:
                        surface.blit(
                            images[4], (g.width + 30 + (i - line*(krant_in_a_line))*25, 74 + counter + 16*line))
            else:
                for i in range(g.krant_to_get):
                    if i < g.food_types["krant"]:
                        surface.blit(
                            images[5], (g.width + 30 + i*35, 85 + counter))
                    else:
                        surface.blit(
                            images[6], (g.width + 30 + i*35, 85 + counter))
        elif f_type == "beer":
            for i in range(g.beer_to_get):
                if i < g.food_types["beer"]:
                    surface.blit(
                        images[1], (g.width + 30 + i*20, 74 + counter))
                else:
                    surface.blit(
                        images[2], (g.width + 30 + i*20, 74 + counter))
        elif f_type == "weed":
            pygame.draw.rect(
                surface, g.food_colors[f_type], (g.width + 30, 85 + counter, 25, 25))
            food_eaten = g.font.render(
                "x " + str(g.food_types[f_type]) + "/" + str(g.weed_to_get), False, (255, 255, 255))
            surface.blit(food_eaten, (g.width + 70, 90 + counter))
        elif f_type == "coffie":
            pygame.draw.rect(
                surface, g.food_colors[f_type], (g.width + 30, 85 + counter, 25, 25))
            if g.coffie_lives_obtained < g.coffie_total_lives:
                food_eaten = g.font.render(
                    "x " + str(g.food_types[f_type]) + "/" + str(g.coffie_to_get[g.coffie_lives_obtained]), False, (255, 255, 255))
            else:
                food_eaten = g.font.render(
                    "x " + str(g.food_types[f_type]), False, (255, 255, 255))
            for i in range(g.coffie_lives_obtained-g.coffie_lives_used):
                surface.blit(images[0], (g.width + 150 + i*30, 80 + counter))
            surface.blit(food_eaten, (g.width + 70, 90 + counter))

        else:
            pygame.draw.rect(
                surface, g.food_colors[f_type], (g.width + 30, 85 + counter, 25, 25))
            food_eaten = g.font.render(
                "x " + str(g.food_types[f_type]), False, text_color)
            surface.blit(food_eaten, (g.width + 70, 90 + counter))
        counter += 40

    if g.main_obj_collected != g.main_obj_total:
        next_object = g.font.render(
            "Next Object is in:", False, text_color)
        surface.blit(next_object, (g.width + 20, 90 + counter))
        counter += 40
        next_object = g.font.render(
            g.main_obj_locations[g.main_obj_collected], False, text_color)
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

    if nick != "":
        nickname = nick

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
                if event.key == pygame.K_RETURN or event.key == pygame.K_SPACE:
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
        window.fill((0, 0, 0))

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

        window.fill((0, 0, 0))
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

        window.fill((0, 0, 0))
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

    if len(nickname) < 2 or len(nickname) > 100:
        return nick
    else:
        return nickname


def pause_menu(window=None, g=None):
    (w, h) = pygame.display.get_surface().get_size()
    choice = ""
    font = pygame.font.SysFont('Consolas', 28)
    pause_font = pygame.font.SysFont('Consolas', 60)
    color_inactive = pygame.Color('darkgreen')
    color_active = pygame.Color('green1')
    active = 1

    transparency = 175

    choice = ""

    rect_x = g.width/2 - 156/2

    pause_surface = pause_font.render("PAUSE", True, color_active)

    pause_x = g.width/2 - pause_surface.get_width()/2

    resume_box = pygame.Rect(rect_x, 100, 156, 32)
    resume_color = color_active
    resume_surface = font.render("RESUME", True, resume_color)
    restart_box = pygame.Rect(rect_x, 170, 156, 32)
    restart_color = color_inactive
    restart_surface = font.render("RESTART", True, restart_color)
    main_menu_box = pygame.Rect(rect_x, 240, 156, 32)
    main_menu_color = color_inactive
    main_menu_surface = font.render("MAIN MENU", True, main_menu_color)
    quit_box = pygame.Rect(rect_x, 310, 156, 32)
    quit_color = color_inactive
    quit_surface = font.render("QUIT", True, quit_color)
    background_surface = pygame.Surface((w, h), pygame.SRCALPHA)
    pygame.draw.rect(background_surface, (0, 0, 0, transparency),
                     background_surface.get_rect())
    window.blit(background_surface, (0, 0))

    while choice == "":
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                exit()
            if event.type == pygame.MOUSEBUTTONDOWN:
                if resume_box.collidepoint(event.pos):
                    active = 1
                    resume_color = color_active
                    restart_color = color_inactive
                    main_menu_color = color_inactive
                    quit_color = color_inactive
                    choice = "resume"

                elif restart_box.collidepoint(event.pos):
                    active = 2
                    resume_color = color_inactive
                    restart_color = color_active
                    main_menu_color = color_inactive
                    quit_color = color_inactive
                    choice = "restart"
                elif main_menu_box.collidepoint(event.pos):
                    active = 3
                    resume_color = color_inactive
                    restart_color = color_inactive
                    main_menu_color = color_active
                    quit_color = color_inactive
                    choice = "main_menu"
                elif quit_box.collidepoint(event.pos):
                    active = 4
                    resume_color = color_inactive
                    restart_color = color_inactive
                    main_menu_color = color_inactive
                    quit_color = color_active
                    choice = "quit"
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_RETURN or event.key == pygame.K_SPACE:
                    if active == 1:
                        choice = "resume"
                    elif active == 2:
                        choice = "restart"
                    elif active == 3:
                        choice = "main_menu"
                    elif active == 4:
                        choice = "quit"
                elif event.key == pygame.K_DOWN:
                    if active == 1:
                        active = 2
                        resume_color = color_inactive
                        restart_color = color_active
                    elif active == 2:
                        active = 3
                        restart_color = color_inactive
                        main_menu_color = color_active
                    elif active == 3:
                        active = 4
                        main_menu_color = color_inactive
                        quit_color = color_active
                    elif active == 4:
                        active = 1
                        quit_color = color_inactive
                        resume_color = color_active
                elif event.key == pygame.K_UP:
                    if active == 1:
                        active = 4
                        resume_color = color_inactive
                        quit_color = color_active
                    elif active == 2:
                        active = 1
                        restart_color = color_inactive
                        resume_color = color_active
                    elif active == 3:
                        active = 2
                        main_menu_color = color_inactive
                        restart_color = color_active
                    elif active == 4:
                        active = 3
                        quit_color = color_inactive
                        main_menu_color = color_active

        resume_surface = font.render("RESUME", True, resume_color)
        restart_surface = font.render("RESTART", True, restart_color)
        main_menu_surface = font.render("MAIN MENU", True, main_menu_color)
        quit_surface = font.render("QUIT", True, quit_color)

        window.blit(pause_surface, (pause_x, 20))

        window.blit(resume_surface, (resume_box.x + resume_box.width /
                                     2 - resume_surface.get_width()/2, resume_box.y+5))
        window.blit(restart_surface, (restart_box.x + restart_box.width /
                                      2 - restart_surface.get_width()/2, restart_box.y+5))
        window.blit(main_menu_surface, (main_menu_box.x + main_menu_box.width /
                                        2 - main_menu_surface.get_width()/2, main_menu_box.y+5))
        window.blit(quit_surface, (quit_box.x + quit_box.width /
                                   2 - quit_surface.get_width()/2, quit_box.y+5))

        pygame.draw.rect(window, resume_color, resume_box, 2)
        pygame.draw.rect(window, restart_color, restart_box, 2)
        pygame.draw.rect(window, main_menu_color, main_menu_box, 2)
        pygame.draw.rect(window, quit_color, quit_box, 2)
        pygame.display.update()
        clock.tick(30)
    return choice


def game_ended_menu(window=None, g=None, connected=False, client=None, nickname="", score=0):
    (w, h) = pygame.display.get_surface().get_size()
    choice = ""
    font = pygame.font.SysFont('Consolas', 28)
    game_over_font = pygame.font.SysFont('Consolas', 60)
    score_font = pygame.font.SysFont('Consolas', 40)
    color_inactive = pygame.Color('darkgreen')
    color_active = pygame.Color('green1')
    active = 1

    choice = ""

    rect_x = w/2 - 156/2

    game_over_surface = game_over_font.render("GAME OVER", True, color_active)
    score_surface = score_font.render(
        nickname + ": " + str(score) + " points", True, color_active)

    game_over_x = w/2 - game_over_surface.get_width()/2
    score_x = w/2 - score_surface.get_width()/2

    push_score_box = pygame.Rect(rect_x, 170, 156, 32)
    push_score_color = color_active
    push_score_surface = font.render("POST SCORE", True, push_score_color)
    retry_box = pygame.Rect(rect_x, 240, 156, 32)
    retry_color = color_inactive
    retry_surface = font.render("REPLAY", True, retry_color)
    main_menu_box = pygame.Rect(rect_x, 310, 156, 32)
    main_menu_color = color_inactive
    main_menu_surface = font.render("MAIN MENU", True, main_menu_color)
    quit_box = pygame.Rect(rect_x, 380, 156, 32)
    quit_color = color_inactive
    quit_surface = font.render("QUIT", True, quit_color)

    if not connected:
        pushed = True
        success = False
        active = 2
        push_score_color = color_inactive
        retry_color = color_active
    else:
        pushed = False
        success = False

    while choice == "":
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                exit()
            if event.type == pygame.MOUSEBUTTONDOWN:
                if push_score_box.collidepoint(event.pos):
                    if not pushed:
                        pushed = True
                        if connected:
                            success = client.add_highscore(nickname, score)
                        active = 2
                        push_score_color = color_inactive
                        retry_color = color_active
                        main_menu_color = color_inactive
                        quit_color = color_inactive

                elif retry_box.collidepoint(event.pos):
                    active = 2
                    push_score_color = color_inactive
                    retry_color = color_active
                    main_menu_color = color_inactive
                    quit_color = color_inactive
                    choice = "retry"
                elif main_menu_box.collidepoint(event.pos):
                    active = 3
                    push_score_color = color_inactive
                    retry_color = color_inactive
                    main_menu_color = color_active
                    quit_color = color_inactive
                    choice = "main_menu"
                elif quit_box.collidepoint(event.pos):
                    active = 4
                    push_score_color = color_inactive
                    retry_color = color_inactive
                    main_menu_color = color_inactive
                    quit_color = color_active
                    choice = "quit"
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_RETURN or event.key == pygame.K_SPACE:
                    if active == 1:
                        if not pushed:
                            pushed = True
                            if connected:
                                success = client.add_highscore(nickname, score)
                        active = 2
                        push_score_color = color_inactive
                        retry_color = color_active
                    elif active == 2:
                        choice = "retry"
                    elif active == 3:
                        choice = "main_menu"
                    elif active == 4:
                        choice = "quit"
                elif event.key == pygame.K_DOWN:
                    if active == 1:
                        active = 2
                        push_score_color = color_inactive
                        retry_color = color_active
                    elif active == 2:
                        active = 3
                        retry_color = color_inactive
                        main_menu_color = color_active
                    elif active == 3:
                        active = 4
                        main_menu_color = color_inactive
                        quit_color = color_active
                    elif active == 4:
                        if pushed:
                            active = 2
                            quit_color = color_inactive
                            retry_color = color_active
                        else:
                            active = 1
                            quit_color = color_inactive
                            push_score_color = color_active
                elif event.key == pygame.K_UP:
                    if active == 1:
                        active = 4
                        push_score_color = color_inactive
                        quit_color = color_active
                    elif active == 2:
                        if pushed:
                            active = 4
                            retry_color = color_inactive
                            quit_color = color_active
                        else:
                            active = 1
                            retry_color = color_inactive
                            push_score_color = color_active
                    elif active == 3:
                        active = 2
                        main_menu_color = color_inactive
                        retry_color = color_active
                    elif active == 4:
                        active = 3
                        quit_color = color_inactive
                        main_menu_color = color_active
        window.fill((0, 0, 0))
        if pushed and success:
            push_score_surface = font.render(
                "SCORE POSTED", True, push_score_color)
        elif pushed and not connected:
            push_score_surface = font.render(
                "CANNOT POST SCORE", True, push_score_color)
        elif pushed and not success:
            push_score_surface = font.render(
                "FAILED TO POST SCORE", True, push_score_color)
        else:
            push_score_surface = font.render(
                "POST SCORE", True, push_score_color)
        retry_surface = font.render("REPLAY", True, retry_color)
        main_menu_surface = font.render("MAIN MENU", True, main_menu_color)
        quit_surface = font.render("QUIT", True, quit_color)

        window.blit(game_over_surface, (game_over_x, 20))
        window.blit(score_surface, (score_x, 100))

        window.blit(push_score_surface, (push_score_box.x + push_score_box.width /
                                         2 - push_score_surface.get_width()/2, push_score_box.y+5))
        window.blit(retry_surface, (retry_box.x + retry_box.width /
                                    2 - retry_surface.get_width()/2, retry_box.y+5))
        window.blit(main_menu_surface, (main_menu_box.x + main_menu_box.width /
                                        2 - main_menu_surface.get_width()/2, main_menu_box.y+5))
        window.blit(quit_surface, (quit_box.x + quit_box.width /
                                   2 - quit_surface.get_width()/2, quit_box.y+5))

        if not pushed:
            pygame.draw.rect(window, push_score_color, push_score_box, 2)
        pygame.draw.rect(window, retry_color, retry_box, 2)
        pygame.draw.rect(window, main_menu_color, main_menu_box, 2)
        pygame.draw.rect(window, quit_color, quit_box, 2)
        pygame.display.update()
        clock.tick(30)
    return choice


def connect_server(client, *argv):
    success = False
    if len(argv) == 2:
        success = client.authenticate(argv[0], argv[1])
    else:
        success = client.authenticate()
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
nickname = "Housemate"
temp_nickname = ""
local_scores_read = None
try:
    local_scores_read = open("Local_scores.txt", "r")
    first_line = local_scores_read.readline()
    w = first_line.split()
    w.pop()
    nickname = ' '.join(w)
    local_scores_read.close()
except:
    local_scores_read = None
local_scores_file = open("Local_scores.txt", "a")

images = []

images.append(pygame.image.load("images/coffie_cup.png"))
images.append(pygame.image.load("images/beer_bottle.png"))
images.append(pygame.image.load("images/beer_bottle_gray.png"))
images.append(pygame.image.load("images/newspaper.png"))
images.append(pygame.image.load("images/newspaper_gray.png"))
images.append(pygame.transform.scale(images[3], (int(
    images[3].get_rect().size[0]*1.5), int(images[3].get_rect().size[1]*1.5))))
images.append(pygame.transform.scale(images[4], (int(
    images[4].get_rect().size[0]*1.5), int(images[4].get_rect().size[1]*1.5))))
images.append(pygame.transform.scale(
    pygame.image.load("images/weed.png"), (16, 32)))
images.append(pygame.image.load("images/Andrea_Chess_knight.png"))
images.append(pygame.transform.scale(
    pygame.image.load("images/GR_gustav.png"), (30, 30)))
images.append(pygame.transform.scale(
    pygame.image.load("images/friespixelart.png"), (23, 30)))
images.append(pygame.transform.scale(
    pygame.image.load("images/JarnoTrekker2.png"), (30, 30)))
images.append(pygame.transform.scale(pygame.image.load(
    "images/Marcus_Painting.jpeg"), (179, 159)))
connected = False

client = ServerClient()
connected = connect_server(client)

while True:
    connected, status, nickname = menu(
        window=window, client=client, g=g, nick=nickname, connected=connected)

    score = 0
    game_ended = False
    paused = False
    if status == "quit":
        exit()
    elif status == "play":
        while True:
            pygame.time.delay(50)
            clock.tick(15)
            climbed, score, game_ended, paused = g.s.move(g)
            if game_ended:
                g.reset(100, 20)
                local_scores_file.write(nickname + " " + str(score) + "\n")
                choice = game_ended_menu(
                    window=window, g=g, client=client, connected=connected, nickname=nickname, score=score)
                if choice == "retry":
                    choice = ""
                elif choice == "main_menu":
                    choice = ""
                    break
                elif choice == "quit":
                    choice = ""
                    exit()
                score = 0
                game_ended = False
            redraw_game_window(window, g, nickname, images)
            if paused:
                choice = pause_menu(window=window, g=g)
                if choice == "resume":
                    choice = ""
                elif choice == "restart":
                    choice = ""
                    g.reset(100, 20)
                elif choice == "main_menu":
                    choice = ""
                    g.reset(100, 20)
                    break
                elif choice == "quit":
                    choice = ""
                    exit()

            if climbed:
                pygame.time.delay(400)
