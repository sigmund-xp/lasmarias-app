import { Farrier } from '../models/Farrier.js'

export const getOneFarrier = async (req, res) => {
  console.log('getOneFarrier')
  const farrierId = req.params.id
  try {
    const farrier = await Farrier.findById(farrierId)
    if (!farrier) return res.status(404).json({ error: 'El herrero no existe' })

    return res.json({ farrier })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
}

export const getListFarriers = async (req, res) => {
  console.log('getListFarriers')
  try {
    const farriers = await Farrier.find()
    return res.json({ farriers: farriers || [] })
  } catch (error) {
    console.error('Error fetching farriers:', error)
    return res.status(500).json({ error: 'Error al obtener los herreros' })
  }
}

export const createFarrier = async (req, res) => {
  console.log('createFarrier')
  const { email, name, phoneArea, phoneNumber } = req.body

  try {
    let farrier = await Farrier.findOne({ email })
    if (farrier) return res.status(403).json({ error: 'El herreroya existe' })

    farrier = new Farrier({ email, name, phoneArea, phoneNumber })
    await farrier.save()

    return res.status(201).json({ id: farrier.id })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
}

export const updateFarrier = async (req, res) => {
  console.log('updateFarrier')
  const farrierId = req.params.id
  const { name, phoneArea, phoneNumber } = req.body

  try {
    const farrier = await Farrier.findByIdAndUpdate(farrierId, { name, phoneArea, phoneNumber })
    if (!farrier) return res.status(404).json({ error: 'Error al actualizar el herrero.' })

    return res.json({ farrier })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
}

export const deleteFarrier = async (req, res) => {
  console.log('deleteFarrier')
  const farrierId = req.params.id

  try {
    await Farrier.findByIdAndDelete(farrierId)
    return res.json({ ok: true })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
}
