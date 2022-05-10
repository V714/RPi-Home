import sys
import RPi.GPIO as GPIO
import time

if __name__ == "__main__":
    GPIO.setmode(GPIO.BCM)

    door = 21

    GPIO.setwarnings(False)
    GPIO.setup(door,GPIO.IN)

    print(GPIO.input(door))
