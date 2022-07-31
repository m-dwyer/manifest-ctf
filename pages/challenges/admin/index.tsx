import { faEdit, faRemove } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import AddChallengeForm from "components/AddChallengeForm";
import Modal from "components/Modal";

import { useEffect, useState } from "react";
import { Challenge } from "types/Challenge";

enum ModalType {
  TEXT,
  CHALLENGE_FORM,
}

const ChallengesAdminPage = () => {
  const [challenges, setChallenges] = useState<Challenge[] | null>([]);

  const [modalType, setModalType] = useState<ModalType>(ModalType.TEXT);
  const [modalState, setModalState] = useState<{
    modalType?: MODAL_TYPE;
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

  const handleAdd = async () => {
    setModalType(ModalType.CHALLENGE_FORM);
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
                  <span className="tooltip" data-tip="Edit">
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

      {modal && modalType == ModalType.CHALLENGE_FORM ? (
        <Modal>
          <h3 className="font-bold text-lg">Add Challenge</h3>
          <p className="py-4">
            <AddChallengeForm />
          </p>
        </Modal>
      ) : null}
    </>
  );
};

export default ChallengesAdminPage;
