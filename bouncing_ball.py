import pygame
import math
import sys

try:
    # Initialize Pygame
    pygame.init()
    print("Pygame initialized successfully")

    # Set up the display
    WIDTH = 800
    HEIGHT = 600
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption("Bouncing Ball and Rotating Triangle")
    print("Window created successfully")

    # Colors
    WHITE = (255, 255, 255)
    YELLOW = (255, 255, 0)
    BLUE = (0, 0, 255)

    # Ball properties
    ball_radius = 20
    ball_x = WIDTH // 2
    ball_y = HEIGHT // 2
    ball_speed_x = 5
    ball_speed_y = 5

    # Triangle properties
    triangle_center = (WIDTH // 2, HEIGHT // 2)
    triangle_size = 80
    triangle_angle = 0
    rotation_speed = 2

    # Game loop
    clock = pygame.time.Clock()
    print("Starting game loop...")

    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

        # Update ball position
        ball_x += ball_speed_x
        ball_y += ball_speed_y

        # Ball collision with walls
        if ball_x <= ball_radius or ball_x >= WIDTH - ball_radius:
            ball_speed_x *= -1
        if ball_y <= ball_radius or ball_y >= HEIGHT - ball_radius:
            ball_speed_y *= -1

        # Update triangle rotation
        triangle_angle += rotation_speed

        # Clear screen
        screen.fill(WHITE)

        # Draw ball
        pygame.draw.circle(screen, YELLOW, (int(ball_x), int(ball_y)), ball_radius)

        # Calculate triangle vertices
        vertices = []
        for i in range(3):
            angle = math.radians(triangle_angle + (i * 120))
            x = triangle_center[0] + triangle_size * math.cos(angle)
            y = triangle_center[1] + triangle_size * math.sin(angle)
            vertices.append((x, y))

        # Draw triangle
        pygame.draw.polygon(screen, BLUE, vertices)

        # Update display
        pygame.display.flip()

        # Control frame rate
        clock.tick(60)

except Exception as e:
    print(f"An error occurred: {e}")
finally:
    pygame.quit()
    print("Pygame closed")