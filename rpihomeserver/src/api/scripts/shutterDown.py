import time
import board
import digitalio
from adafruit_motor import stepper

DELAY = 0.01
STEPS = 2200

coils = (
    digitalio.DigitalInOut(board.D19),
    digitalio.DigitalInOut(board.D16),
    digitalio.DigitalInOut(board.D6),
    digitalio.DigitalInOut(board.D12),

)

for coil in coils:
    coil.direction = digitalio.Direction.OUTPUT

motor = stepper.StepperMotor(coils[0],coils[1],coils[2],coils[3],microsteps=None)


for step in range(STEPS):
    motor.onestep(style=stepper.DOUBLE,direction=stepper.BACKWARD)
    time.sleep(DELAY)

for coil in coils:
    coil.direction = digitalio.Direction.INPUT
