import { collection, deleteDoc, doc, addDoc as addFirestoreDoc, getDocs, updateDoc as updateFirestoreDoc } from "firebase/firestore";
import { auth, db } from "../../Firebase-config";



export async function buscarDoc() {
    //pendente
}
export async function buscarDocs() {
    return new Promise(async (resolve, reject) => {
        try {
            const user = auth.currentUser
            const docRef = collection(db, `Registros/${user.uid}/Registros`);
            const data = await getDocs(docRef);
            const res = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            resolve(res);
        } catch (error) {
            reject(error);
        }
    })
}
export async function addDoc(params) {
    return new Promise(async (resolve, reject) => {
        const user = auth.currentUser
        await addFirestoreDoc(collection(db, `Registros/${user.uid}/Registros`), {
            data: params.data,
            descricao: params.descricao,
            formaDePagamento: params.formaDePagamento,
            nome: params.nome,
            nomeClienteOuComprador: params.nomeClienteOuComprador,
            tipo: params.tipo,
            valor: params.valor,
        }).catch((err) => {
            reject(err)
        }).then(() => {
            resolve()
        })
    })
}
export async function removeDoc(id) {
    return new Promise(async (resolve, reject) => {
        const user = auth.currentUser
        await deleteDoc(doc(db, `Registros/${user.uid}/Registros`, id))
            .then(() => {
                resolve()
            })
            .catch((err) => {
                reject(err)
            })
    })
}
export async function updateDoc(params) {
    return new Promise(async (resolve, reject) => {
        const user = auth.currentUser
        const updateRef = doc(db, `Registros/${user.uid}/Registros`, params.id);
        await updateFirestoreDoc(updateRef, {
            data: params.data,
            descricao: params.descricao,
            formaDePagamento: params.formaDePagamento,
            nome: params.nome,
            nomeClienteOuComprador: params.nomeClienteOuComprador,
            tipo: params.tipo,
            valor: params.valor,

        }).catch((err) => {
            reject(err)
        }).then(() => {
            resolve()
        })
    })
}