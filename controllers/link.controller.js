import { nanoid } from 'nanoid'
import { Link } from '../models/Link.js'

export const getLinks = async (req, res) => {
  try {
    const links = await Link.find({ uid: req.uid })
    return res.json({ links })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Error del servidor' })
  }
}

export const getLink = async (req, res) => {
  try {
    const { id } = req.params
    const link = await Link.findOne({ _id: id, uid: req.uid })
    if (!link) return res.status(404).json({ error: 'No existe el Link' })

    return res.json({ link })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Error del servidor' })
  }
}

export const createLink = async (req, res) => {
  try {
    const { longLink } = req.body
    const link = new Link({ longLink, nanoLink: nanoid(8), uid: req.uid })
    const newLink = await link.save()
    return res.status(201).json({ newLink })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Error del servidor' })
  }
}

export const deleteLink = async (req, res) => {
  try {
    const { id } = req.params
    const link = await Link.findOneAndDelete({ _id: id, uid: req.uid })
    if (!link) return res.status(404).json({ error: 'No existe el Link' })

    return res.json({ link })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Error del servidor' })
  }
}

export const updateLink = async (req, res) => {
  try {
    const { id } = req.params
    const { longLink } = req.body
    const link = await Link.findOneAndUpdate({ _id: id, uid: req.uid }, { longLink })
    if (!link) return res.status(404).json({ error: 'No existe el Link' })

    return res.json({ link })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Error del servidor' })
  }
}
