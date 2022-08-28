import { FaEdit, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";

import { ChallengeWithCategories } from "@/types/Challenge";
import ChallengeForm from "@/challenges/components/ChallengeForm";
import Modal from "@/common/components/Modal";

enum ModalType {
  TEXT,
  ADD_CHALLENGE_FORM,
  EDIT_CHALLENGE_FORM,
}

const ChallengesAdminPage = () => {
  const [challenges, setChallenges] = useState<
    ChallengeWithCategories[] | null
  >([]);
  const [editingChallenge, setEditingChallenge] =
    useState<ChallengeWithCategories | null>(null);

  const [modalType, setModalType] = useState<ModalType>(ModalType.TEXT);
  const [modalState, setModalState] = useState<{
    modalType?: ModalType;
    title?: string;
    text?: string;
  }>({});
  const [modal, setModal] = useState(false);

  const handleDismiss = () => setModal(false);

  const handleSave = (challenge: ChallengeWithCategories) => {
    const savedChallenges =
      challenges?.map((c) => (c.id == challenge.id ? challenge : c)) || [];
    setChallenges(savedChallenges);
  };

  const fetchChallenges = async () => {
    const result = await fetch(`/api/challenges/admin`);
    const json = await result.json();

    setChallenges(json.data as ChallengeWithCategories[]);
  };

  const handleUpdate = (c: ChallengeWithCategories) => {
    setModalType(ModalType.EDIT_CHALLENGE_FORM);
    setEditingChallenge(c);
    setModal(true);
  };

  const handleAdd = async () => {
    setModalType(ModalType.ADD_CHALLENGE_FORM);
    setModal(true);
  };

  const handleDelete = async (challenge: number) => {
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ challenge: challenge }),
    };

    const result = await fetch(`/api/challenges/admin`, options);
    const json = await result.json();

    setModalType(ModalType.TEXT);
    if (json.deleted) {
      setModalState({
        title: "Deleted",
        text: "Challenge deleted",
      });
      setModal(true);

      setChallenges(challenges?.filter((c) => c.id != challenge) || []);
    } else {
      setModalState({
        title: "Error",
        text: "Error deleting challenge",
      });
      setModal(true);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  return (
    <>
      <button className="btn" onClick={handleAdd}>
        Add
      </button>
      <table className="table w-full">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Flag</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {challenges &&
            challenges.map((c) => {
              return (
                <tr key={c.id}>
                  <th className="flex gap-4">
                    <span
                      className="tooltip"
                      data-tip="Edit"
                      onClick={() => handleUpdate(c)}
                    >
                      <FaEdit />
                    </span>
                    <span
                      className="tooltip"
                      data-tip="Delete"
                      onClick={() => c.id && handleDelete(c.id)}
                    >
                      <FaTrash />
                    </span>
                  </th>
                  <th>{c.name}</th>
                  <th>{c.description}</th>
                  <th>{c.category?.name}</th>
                  <th>{c.flag}</th>
                  <th>{c.points}</th>
                </tr>
              );
            })}
        </tbody>
      </table>
      {modal && modalType == ModalType.TEXT ? (
        <Modal handleDismiss={handleDismiss}>
          <h3 className="font-bold text-lg">{modalState.title}</h3>
          <p className="py-4">{modalState.text}</p>
        </Modal>
      ) : null}

      {modal && modalType == ModalType.ADD_CHALLENGE_FORM ? (
        <Modal>
          <span className="flex justify-between">
            <h3 className="font-bold text-lg inline-block">Add Challenge</h3>
            <div className="btn" onClick={handleDismiss}>
              X
            </div>
          </span>

          <p className="py-4">
            <ChallengeForm
              handleSave={handleSave}
              handleDismiss={handleDismiss}
            />
          </p>
        </Modal>
      ) : null}

      {modal && modalType == ModalType.EDIT_CHALLENGE_FORM ? (
        <Modal>
          <span className="flex justify-between">
            <h3 className="font-bold text-lg inline-block">Edit Challenge</h3>
            <div className="btn" onClick={handleDismiss}>
              X
            </div>
          </span>
          <p className="py-4">
            <ChallengeForm
              handleDismiss={handleDismiss}
              handleSave={handleSave}
              challenge={editingChallenge}
            />
          </p>
        </Modal>
      ) : null}
    </>
  );
};

export default ChallengesAdminPage;
