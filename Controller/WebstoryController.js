import db from "../config/db.js";

export const addwebstory = async (req, res) => {
    const { title, description, pages } = req.body;
    db.query("INSERT INTO stories (title, description) VALUES (?, ?)", [title, description], (err, result) => {
        if (err) return res.status(500).json(err);

        const storyId = result.insertId;
        const pageQueries = pages.map((page) => {
            return new Promise((resolve, reject) => {
                db.query(
                    "INSERT INTO pages (story_id, content, media_url, media_type) VALUES (?, ?, ?, ?)",
                    [storyId, page.content, page.media_url, page.media_type],
                    (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    }
                );
            });
        });

        Promise.all(pageQueries)
            .then(() => res.json({ message: "Story created successfully", id: storyId }))
            .catch((err) => res.status(500).json(err));
    });

}

export const fetchstory = async(req,res) => {
    db.query("SELECT * FROM stories", (err, stories) => {
        if (err) return res.status(500).json(err);

        const storyPromises = stories.map((story) => {
            return new Promise((resolve, reject) => {
                db.query("SELECT * FROM pages WHERE story_id = ?", [story.id], (err, pages) => {
                    if (err) reject(err);
                    else resolve({ ...story, pages });
                });
            });
        });

        Promise.all(storyPromises)
            .then((fullStories) => res.json(fullStories))
            .catch((err) => res.status(500).json(err));
    });
}

export const fetchonestory = (req, res) => {
    const storyId = req.params.id;

    if (!storyId) {
        return res.status(400).json({ message: "Story ID is required" });
    }

    // Fetch story details
    db.query("SELECT * FROM stories WHERE id = ?", [storyId], (err, storyResult) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ message: "Server error" });
        }

        if (!storyResult.length) {
            return res.status(404).json({ message: "Story not found" });
        }

        const story = storyResult[0]; // Get first matching story

        // Fetch story pages
        db.query("SELECT * FROM pages WHERE story_id = ? ", [storyId], (err, pagesResult) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ message: "Server error" });
            }

            story.pages = pagesResult.length ? pagesResult : []; // Ensure it's an array

            res.json(story);
        });
    });
};

