import { FC } from "react";
import ReactModal from "react-modal";
import styled from "styled-components";

interface Props {
  isOpen: boolean;
  closeModal?: () => void;
  children?: React.ReactNode;
  contentLabel?: string;
}

const Modal: FC<Props> = ({ isOpen, closeModal, children, contentLabel }) => {
  return (
    <Style isOpen={isOpen} onRequestClose={closeModal} contentLabel={contentLabel}>
      {closeModal && (
        <button className="close icon md" onClick={closeModal}>
        </button>
      )}
      {contentLabel && <h4>{contentLabel}</h4>}
      {children}
    </Style>
  );
};

export default Modal;

const Style = styled(ReactModal)`
  > h4 {
    margin-bottom: 30px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
    font-weight: 500;
  }
`;
