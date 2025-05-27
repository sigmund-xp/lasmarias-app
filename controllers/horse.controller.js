import { Horse } from '../models/Horse.js'
import { User } from '../models/User.js'
import mongoose from 'mongoose'

export const getOneHorse = async (req, res) => {
  console.log('getOneHorse')
  const horseId = req.params.id
  try {
    const horse = await Horse.findOne({ id: horseId, ownerId: req.uid })
    if (!horse) return res.status(404).json({ error: 'El caballo no existe' })

    return res.json({ horse })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
}

export const getListHorses = async (req, res) => {
  try {
    const user = await User.findById(req.uid)
    if (!user) {
      return res.json({ horses: [] })
    } else {
      if (user.isOwner) {
        return getListHorsesByHorseName(req, res)
      } else {
        return getListHorsesByNameOwner(req, res)
      }
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
}

const getListHorsesByHorseName = async (req, res) => {
  console.log('getListHorsesByHorseName')
  const { horseName } = req.body

  try {
    const horses = await Horse.aggregate([
      {
        $lookup: {
          from: 'Usuarios',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'propietario'
        }
      },
      {
        $unwind: '$propietario'
      },
      {
        $match: {
          nombre: { $regex: horseName, $options: 'i' },
          'propietario._id': new mongoose.Types.ObjectId(req.uid)
        }
      }
    ])

    return res.json({ horses })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
}

const getListHorsesByNameOwner = async (req, res) => {
  console.log('getListHorsesByNameOwner')
  const { horseName, ownerName } = req.body

  try {
    const horses = await Horse.aggregate([
      {
        $lookup: {
          from: 'Usuarios',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'propietario'
        }
      },
      {
        $unwind: '$propietario'
      },
      {
        $match: {
          nombre: { $regex: horseName, $options: 'i' },
          'propietario.nombre': { $regex: ownerName, $options: 'i' }
        }
      }
    ])

    return res.json({ horses })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
}

export const createHorse = async (req, res) => {
  console.log('createHorse')
  const { nombre, genero, raza, pelaje, alzada, fechaNacimiento, microchip, mi, sba, nroFederado, imageId } = req.body

  try {
    let horse = await Horse.findOne({ nombre, ownerId: req.uid })
    if (horse) return res.status(403).json({ error: 'El caballo ya existe' })

    horse = new Horse({ nombre, genero, raza, pelaje, alzada, fechaNacimiento, microchip, mi, sba, nroFederado, ownerId: req.uid, imageId })
    await horse.save()

    return res.status(201).json({ id: horse.id })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
}

export const updateHorse = async (req, res) => {
  console.log('updateHorse')
  const horseId = req.params.id
  const { nombre, genero, raza, pelaje, alzada, fechaNacimiento, microchip, mi, sba, nroFederado, ownerId, veterinarianId, physiotherapistId, dentistId, ophthalmologistId, farrierId, imageId } = req.body

  try {
    const horse = await Horse.findOneAndUpdate(
      { id: horseId, ownerId: req.uid },
      { nombre, genero, raza, pelaje, alzada, fechaNacimiento, microchip, mi, sba, nroFederado, ownerId, veterinarianId, physiotherapistId, dentistId, ophthalmologistId, farrierId, imageId }
    )

    if (!horse) return res.status(404).json({ error: 'El caballo no existe' })

    return res.json({ horse })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
}

export const deleteHorse = async (req, res) => {
  console.log('deleteHorse')
  const horseId = req.params.id

  try {
    await Horse.findOneAndDelete({ id: horseId, ownerId: req.uid })
    return res.json({ ok: true })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
}
