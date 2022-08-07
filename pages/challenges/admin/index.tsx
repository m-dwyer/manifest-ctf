import { faEdit, faRemove } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import ChallengeForm from "components/ChallengeForm";
import Modal from "components/Modal";

import { useEffect, useState } from "react";
import { Challenge } from "types/Challenge";

enum ModalType {
  TEXT,
  ADD_CHALLENGE_FORM,
  EDIT_CHALLENGE_FORM,
}

const ChallengesAdminPage = () => {
  const [challenges, setChallenges] = useState<Challenge[] | null>([]);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(
    null
  );

  const [modalType, setModalType] = useState<ModalType>(ModalType.TEXT);
  const [modalState, setModalState] = useState<{
    modalType?: ModalType;
    title?: string;
    text?: string;
  }>({});
  const [modal, setModal] = useState(false);

  const handleDismiss = () => setModal(false);

  const fetchChallenges = async () => {
    const { data: challenges } = await supabaseClient
      .from<Challenge>("challenges")
      .select("*")
      .order("id", { ascending: true });

    setChallenges(challenges);
  };

  const handleUpdate = (c: Challenge) => {
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
            <th>Flag</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {challenges &&
            challenges.map((c) => (
              <tr key={c.id}>
                <th className="flex gap-4">
                  <span
                    className="tooltip"
                    data-tip="Edit"
                    onClick={() => handleUpdate(c)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </span>
                  <span
                    className="tooltip"
                    data-tip="Delete"
                    onClick={() => handleDelete(c.id)}
                  >
                    <FontAwesomeIcon icon={faRemove} />
                  </span>
                </th>
                <th>{c.name}</th>
                <th>{c.description}</th>
                <th>{c.flag}</th>
                <th>{c.points}</th>
              </tr>
            ))}
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
          <h3 className="font-bold text-lg">Add Challenge</h3>
          <p className="py-4">
            <ChallengeForm handleDismiss={handleDismiss} />
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
              challenge={editingChallenge}
            />
          </p>
        </Modal>
      ) : null}
    </>
  );
};

export default ChallengesAdminPage;
