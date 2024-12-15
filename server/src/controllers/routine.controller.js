import routineService from "../services/routine.service.js";

// Create Routine Event endpoint
const createRoutineEvent = async (req, res, next) => {
  try {
    const routineEvents = await routineService.create(req.body);
    return res.status(201).json({ status: "success", routineEvents });
  } catch (error) {
    next(error);
  }
};

// Fetch Routine Events endpoint
const fetchRoutineEvents = async (req, res, next) => {
  try {
    const routineEvents = await routineService.fetch(req.body);
    return res.status(200).json({ status: "success", routineEvents });
  } catch (error) {
    next(error);
  }
};

// Delete Routine Event endpoint
const deleteRoutineEvent = async (req, res, next) => {
  try {
    await routineService.delete(req.body);
    return res.status(200).json({ status: "success" });
  } catch (error) {
    next(error);
  }
};

export { createRoutineEvent, fetchRoutineEvents, deleteRoutineEvent };
