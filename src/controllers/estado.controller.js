const Estado = require('../models/estado.model');

const estadoController = {
  async getAll(req, res) {
    try {
      const estados = await Estado.findAll();
      res.json({
        success: true,
        data: estados
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los estados'
      });
    }
  },

  async getById(req, res) {
    try {
      const estado = await Estado.findById(req.params.id);
      if (!estado) {
        return res.status(404).json({
          success: false,
          message: 'Estado no encontrado'
        });
      }
      res.json({
        success: true,
        data: estado
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el estado'
      });
    }
  },

  async create(req, res) {
    try {
      const estado = await Estado.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Estado creado exitosamente',
        data: estado
      });
    } catch (error) {
      console.error(error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
          success: false,
          message: 'El nombre del estado ya existe'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Error al crear el estado'
      });
    }
  },

  async update(req, res) {
    try {
      const estado = await Estado.update(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Estado actualizado exitosamente',
        data: estado
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el estado'
      });
    }
  },

  async delete(req, res) {
    try {
      await Estado.delete(req.params.id);
      res.json({
        success: true,
        message: 'Estado eliminado exitosamente'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el estado'
      });
    }
  }
};

module.exports = estadoController;