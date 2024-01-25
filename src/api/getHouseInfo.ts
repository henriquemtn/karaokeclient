import { Firestore, DocumentData, getDoc, doc } from 'firebase/firestore';

const getHouseInfo = async (firestore: Firestore, uid: string): Promise<DocumentData | undefined> => {
    try {
        const docRef = doc(firestore, 'houses', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.error('Documento da casa não encontrado.');
            return undefined;
        }
    } catch (error) {
        console.error('Erro ao obter informações da casa:', error);
        return undefined;
    }
};

export default getHouseInfo;
