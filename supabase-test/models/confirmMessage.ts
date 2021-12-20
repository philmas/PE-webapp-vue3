interface ConfirmButton {
  text: string;
  action: () => void;
}

export interface Message {
  title: string;
  content?: string;
  hasCancelButton?: boolean;
  cancelButtonText?: string;
  acceptButton?: ConfirmButton;
  rejectButton?: ConfirmButton;
}
