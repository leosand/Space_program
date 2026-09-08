/* Bookmarks Manager - localStorage persistence */
const Bookmarks = {
    key: 'space_program_bookmarks',

    get() {
        try {
            return JSON.parse(localStorage.getItem(this.key)) || [];
        } catch {
            return [];
        }
    },

    save(ids) {
        localStorage.setItem(this.key, JSON.stringify(ids));
    },

    add(id) {
        const set = new Set(this.get());
        set.add(id);
        this.save([...set]);
    },

    remove(id) {
        this.save(this.get().filter(x => x !== id));
    },

    has(id) {
        return this.get().includes(id);
    }
};
