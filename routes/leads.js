const express = require("express");
const router = express.Router();
const db = require("../config/db");

// =======================
// GET ALL LEADS
// =======================
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM leads ORDER BY created_at DESC"
        );

        res.status(200).json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Unable to fetch leads."
        });
    }
});


// =======================
// GET SINGLE LEAD
// =======================
router.get("/:id", async (req, res) => {

    const { id } = req.params;

    try {

        const [rows] = await db.query(
            "SELECT * FROM leads WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Lead not found."
            });
        }

        res.json(rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Something went wrong."
        });

    }

});


// =======================
// ADD LEAD
// =======================
router.post("/", async (req, res) => {

    const {
        name,
        company,
        email,
        phone,
        status
    } = req.body;

    if (!name || !company || !email) {

        return res.status(400).json({
            message: "Please fill all required fields."
        });

    }

    try {

        await db.query(

            `INSERT INTO leads
            (name, company, email, phone, status)
            VALUES (?, ?, ?, ?, ?)`,

            [
                name,
                company,
                email,
                phone,
                status || "New"
            ]

        );

        res.status(201).json({
            message: "Lead added successfully."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to add lead."
        });

    }

});


// =======================
// UPDATE LEAD
// =======================
router.put("/:id", async (req, res) => {

    const { id } = req.params;

    const {
        name,
        company,
        email,
        phone,
        status
    } = req.body;

    try {

        const [result] = await db.query(

            `UPDATE leads
            SET
                name = ?,
                company = ?,
                email = ?,
                phone = ?,
                status = ?
            WHERE id = ?`,

            [
                name,
                company,
                email,
                phone,
                status,
                id
            ]

        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Lead not found."
            });

        }

        res.json({
            message: "Lead updated successfully."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to update lead."
        });

    }

});


// =======================
// DELETE LEAD
// =======================
router.delete("/:id", async (req, res) => {

    const { id } = req.params;

    try {

        const [result] = await db.query(

            "DELETE FROM leads WHERE id = ?",
            [id]

        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Lead not found."
            });

        }

        res.json({
            message: "Lead deleted successfully."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to delete lead."
        });

    }

});

module.exports = router;