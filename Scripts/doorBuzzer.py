import RPi.GPIO as GPIO
import time

BuzzerPin = 13
DoorPin = 21

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(BuzzerPin, GPIO.OUT) 
GPIO.setup(DoorPin, GPIO.IN, pull_up_down = GPIO.PUD_DOWN)

global Buzz

def play_open():
    Buzz.start(50)
    Buzz.ChangeFrequency(1046)
    time.sleep(0.1)
    Buzz.ChangeFrequency(7902)
    time.sleep(0.05)
    Buzz.stop()

def play_close():
    Buzz.start(50)
    Buzz.ChangeFrequency(7902)
    time.sleep(0.1)
    Buzz.ChangeFrequency(1046)
    time.sleep(0.05)
    Buzz.stop()


Buzz = GPIO.PWM(BuzzerPin, 440) 
if __name__ == "__main__":
    door = GPIO.input(DoorPin)
    while(True):
        door_now = GPIO.input(DoorPin)
        if door_now is not door:
            if door is 1:
                play_close()
                door = 0
            else:
                play_open()
                door = 1
        time.sleep(0.2)
