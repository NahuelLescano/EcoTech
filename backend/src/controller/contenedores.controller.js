export async function getContenedores(req, res) {
  return res.status(200).json({
    message: "GET /api/contenedores listo",
  });
}

export async function createContenedor(req, res) {
  return res.status(201).json({
    message: "POST /api/contenedores listo",
  });
}

export async function updateContenedor(req, res) {
  return res.status(200).json({
    message: `PUT /api/contenedores/${req.params.id} listo`,
  });
}

export async function deleteContenedor(req, res) {
  return res.status(200).json({
    message: `DELETE /api/contenedores/${req.params.id} listo`,
  });
}