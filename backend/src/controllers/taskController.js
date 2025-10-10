import Task from "../models/TaskModel.js";

// get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const allTasks = await Task.find();
    return res.status(200).json({
      success: true,
      message: "Todas as tarefas encontradas com sucesso",
      allTasks,
    });
  } catch (error) {
    console.error("Erro ao buscar tarefa: ", error);
    return res.status(500).json({
      success: false,
      message: "Erro no servidor ao buscar tarefas",
    });
  }
};

// get task by id
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("responsible");
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get tasks stats
export const getTaskStats = async (req, res) => {
  try {

    const stats = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const counts = {
      aguardando_início: 0,
      em_execução: 0,
      finalizada: 0,
      pendente: 0,
      parada: 0,
    };

    const percentages = {
      aguardando_início: 0,
      em_execução: 0,
      finalizada: 0,
      pendente: 0,
      parada: 0,
    };

    stats.forEach((stat) => {
      counts[stat._id] = stat.count;
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    const formattedStats = {
      ...counts,
      percentages: {
        aguardando_início: total ? Math.round((counts.aguardando_início / total) * 100) : 0,
        em_execução: total ? Math.round((counts.em_execução / total) * 100) : 0,
        finalizada: total ? Math.round((counts.finalizada / total) * 100) : 0,
        pendente: total ? Math.round((counts.pendente / total) * 100) : 0,
        parada: total ? Math.round((counts.parada / total) * 100) : 0,
      },
    };

    res.json(formattedStats);

  } catch (error) {
    res.status(500).json({ message: "Error fetching task stats", error });
  }
};

// Create a new task
export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      materials,
      place,
      address,
      responsible,
      status,
      priority,
      dueDate,
      startDate,
      notes,
      attachDocuments,
    } = req.body;

    if (
      !title ||
      !description ||
      !place ||
      !address ||
      !responsible ||
      !status ||
      !priority ||
      !dueDate ||
      !startDate
    ) {
      return res.status(400).json({
        success: false,
        message: "É necessário preencher todos os campos obrigatórios.",
      });
    }

    const newTask = new Task({
      title,
      description,
      materials,
      place,
      address,
      responsible,
      status,
      priority,
      dueDate,
      startDate,
      notes,
      attachDocuments,
    });

    await newTask.save();

    return res.status(201).json({
      success: true,
      message: "Tarefa criada com sucesso.",
      task: newTask,
    });
  } catch (error) {
    console.error("Erro ao criar tarefa: ", error);
    return res.status(500).json({
      success: false,
      message: "Erro no servidor ao criar tarefa.",
    });
  }
};

// Update task
export const updateTask = async (req, res) => {
  try {
    const { title, description, responsible, status } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        responsible,
        status,
      },
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// delete task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update task status
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update checklist item
export const updateChecklist = async (req, res) => {
  try {
    const { checklistIndex, completed } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!task.checklists[checklistIndex]) {
      return res.status(400).json({ message: "Invalid checklist index" });
    }

    task.checklists[checklistIndex].completed = completed;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
