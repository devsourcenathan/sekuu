import { create } from "zustand";

type Course = any;

type CourseState = {
    courses: Course[];
    setCourses: (c: Course[]) => void;
    addCourse: (c: Course) => void;
    clear: () => void;
};

export const useCourseStore = create<CourseState>((set) => ({
    courses: [],
    setCourses(c) {
        set({ courses: c });
    },
    addCourse(c) {
        set((s) => ({ courses: [...s.courses, c] }));
    },
    clear() {
        set({ courses: [] });
    },
}));

export default useCourseStore;
