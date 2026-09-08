/* Bookmarks Manager - localStorage persistence */
const Bookmarks={key:'space_program_bookmarks',get(){try{return JSON.parse(localStorage.getItem(this.key))||[]}catch{return[]}},save(ids){localStorage.setItem(this.key,JSON.stringify(ids))},add(id){const s=new Set(this.get());s.add(id);this.save([...s])},remove(id){this.save(this.get().filter(x=>x!==id))},has(id){return this.get().includes(id)}};
