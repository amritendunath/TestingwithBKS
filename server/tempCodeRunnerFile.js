app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, progress, date } = req.body;
  const { user } = req.user;
  const user_email = user.Items[0].email
  const id = uuidv4();

  if (!title) {
    return res.status(400).json({ error: true, message: "Title is required" });
  }
  if (!date) {
    return res.status(400).json({ error: true, message: "Date is required" });
  }
  if (!user_email) {
    return res.status(400).json({ error: true, message: "User email is required" });
  }

  try {
    const note = await createItem(
      id,
      user_email,
      title,  
      progress,
      date,
    );
    return res.json({
      error: false,
      note,
      message: "Note added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});