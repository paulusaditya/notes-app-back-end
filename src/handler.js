const { nanoid } = require('nanoid');
const notes = [];

// Helper function untuk membuat response
const createResponse = (h, status, message, code, data = {}) => {
    const response = h.response({
        status,
        message,
        data,
    });
    response.code(code);
    return response;
};

const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload;

    if (!title || !body) {
        return createResponse(h, 'fail', 'Gagal menambahkan catatan. Title dan body harus diisi.', 400);
    }

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = { title, tags, body, id, createdAt, updatedAt };
    notes.push(newNote);

    const isSuccess = notes.some((note) => note.id === id);

    if (isSuccess) {
        return createResponse(h, 'success', 'Catatan berhasil ditambahkan', 201, { noteId: id });
    }

    return createResponse(h, 'fail', 'Catatan gagal ditambahkan', 500);
};

const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    },
});

const getNoteByIdHandler = (request, h) => {
    const { id } = request.params;
    const note = notes.find((n) => n.id === id);

    if (note) {
        return {
            status: 'success',
            data: { note },
        };
    }

    return createResponse(h, 'fail', 'Catatan tidak ditemukan', 404);
};

const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;
    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt,
        };

        return createResponse(h, 'success', 'Catatan berhasil diperbarui', 200);
    }

    return createResponse(h, 'fail', 'Gagal memperbarui catatan. Id tidak ditemukan', 404);
};

const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes.splice(index, 1);
        return createResponse(h, 'success', 'Catatan berhasil dihapus', 200);
    }

    return createResponse(h, 'fail', 'Catatan gagal dihapus. Id tidak ditemukan', 404);
};

module.exports = {
    addNoteHandler,
    getAllNotesHandler,
    getNoteByIdHandler,
    editNoteByIdHandler,
    deleteNoteByIdHandler,
};
