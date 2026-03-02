// src/controllers/settings.controller.js
// Mengelola Site Settings (key-value store untuk konfigurasi situs)
const prisma = require('../lib/prisma');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * GET /api/cms/settings
 * Publik — mengembalikan semua settings sebagai satu objek { key: value, ... }
 * aman ditampilkan ke publik karena tidak ada data sensitif
 */
exports.getAll = async (req, res) => {
  try {
    const rows = await prisma.siteSetting.findMany();
    // Ubah array [{ key, value }] menjadi objek { key: value }
    const settings = rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
    return successResponse(res, settings);
  } catch (error) {
    return errorResponse(res, 'Gagal mengambil pengaturan situs.', 500, error);
  }
};

/**
 * GET /api/cms/settings/:key
 * Publik — ambil satu setting berdasarkan key
 */
exports.getOne = async (req, res) => {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: req.params.key },
    });
    if (!setting) return errorResponse(res, 'Setting tidak ditemukan.', 404);
    return successResponse(res, setting);
  } catch (error) {
    return errorResponse(res, 'Gagal mengambil setting.', 500, error);
  }
};

/**
 * PUT /api/cms/settings (Admin only)
 * Body: { key: value, key2: value2, ... }
 * Batch upsert — update banyak settings sekaligus
 */
exports.updateMany = async (req, res) => {
  try {
    const updates = req.body;
    if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
      return errorResponse(res, 'Body harus berupa objek { key: value, ... }', 400);
    }

    // Jalankan semua upsert dalam satu transaksi
    const operations = Object.entries(updates).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    );

    await prisma.$transaction(operations);

    // Kembalikan semua settings terbaru
    const rows = await prisma.siteSetting.findMany();
    const settings = rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    return successResponse(res, settings, 'Pengaturan berhasil disimpan.');
  } catch (error) {
    return errorResponse(res, 'Gagal menyimpan pengaturan.', 500, error);
  }
};

/**
 * POST /api/cms/settings/upload-logo (Admin only)
 * Upload logo sekolah — file di-handle multer, URL disimpan ke SiteSetting
 */
exports.uploadLogo = async (req, res) => {
  try {
    if (!req.file) return errorResponse(res, 'File logo wajib diupload.', 400);

    // Di development: path lokal. Di production: URL Cloudinary dari req.file.path
    const logoUrl = req.file.path?.startsWith('http')
      ? req.file.path  // Cloudinary
      : `/uploads/settings/${req.file.filename}`; // Disk lokal

    await prisma.siteSetting.upsert({
      where: { key: 'site_logo' },
      update: { value: logoUrl },
      create: { key: 'site_logo', value: logoUrl },
    });

    return successResponse(res, { url: logoUrl }, 'Logo berhasil diupload.');
  } catch (error) {
    return errorResponse(res, 'Gagal mengupload logo.', 500, error);
  }
};

/**
 * POST /api/cms/settings/upload-favicon (Admin only)
 * Upload favicon
 */
exports.uploadFavicon = async (req, res) => {
  try {
    if (!req.file) return errorResponse(res, 'File favicon wajib diupload.', 400);

    const faviconUrl = req.file.path?.startsWith('http')
      ? req.file.path
      : `/uploads/settings/${req.file.filename}`;

    await prisma.siteSetting.upsert({
      where: { key: 'site_favicon' },
      update: { value: faviconUrl },
      create: { key: 'site_favicon', value: faviconUrl },
    });

    return successResponse(res, { url: faviconUrl }, 'Favicon berhasil diupload.');
  } catch (error) {
    return errorResponse(res, 'Gagal mengupload favicon.', 500, error);
  }
};
