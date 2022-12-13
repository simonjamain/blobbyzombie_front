export function accelerate(
  initialSpeed: number,
  acceleration: number,
  elapsedTime: number,
  targetSpeed: number = Infinity
) {
    if(acceleration < 0) {
        throw `works only with positive acceleration values : ${acceleration} provided`
    }

    const sign = targetSpeed > initialSpeed ? 1 : -1

    const theoreticalSpeed = initialSpeed + sign * acceleration * elapsedTime

    const cappedSpeed = sign * Math.min(sign * targetSpeed, sign * theoreticalSpeed)

  return cappedSpeed;
}
