const originalLog = console.log

console.log = (...args) => {
  originalLog(`[${getFechaFormateada()}] - `, ...args)
}

function getFechaFormateada () {
  const ahora = new Date()

  const pad = (n, z = 2) => n.toString().padStart(z, '0')

  const dia = pad(ahora.getDate())
  const mes = pad(ahora.getMonth() + 1)
  const anio = ahora.getFullYear()
  const horas = pad(ahora.getHours())
  const minutos = pad(ahora.getMinutes())
  const segundos = pad(ahora.getSeconds())
  const milisegundos = pad(ahora.getMilliseconds(), 3)

  return `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}.${milisegundos}`
}
