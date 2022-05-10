import sys
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)

busy = 26
sleep = 20

GPIO.setwarnings(False)
GPIO.setup(busy,GPIO.OUT)
GPIO.setup(sleep,GPIO.OUT)

def set_lights(yellow,blue,busy,sleep):
    if yellow=='1':
        GPIO.output(busy,GPIO.HIGH)
    else:
        GPIO.output(busy,GPIO.LOW)

    if blue=='1':
        GPIO.output(sleep,GPIO.HIGH)
    else:
        GPIO.output(sleep,GPIO.LOW)
           

if __name__ == "__main__":
    set_lights(sys.argv[1],sys.argv[2],busy,sleep)
