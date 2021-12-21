export interface UserDataInterface {
  id: string;
  email: string;
  name_first: string;
  name_insertion: string;
  name_last: string;
  name_initials: string;
  payment_method: string;
  phone_number: string;
  photo_id: string;
  student_number: string;
  year_group: string;
}

export class UserData implements UserData {
  id: string;
  email: string;
  name_first: string;
  name_insertion: string;
  name_last: string;
  name_initials: string;
  payment_method: string;
  phone_number: string;
  photo_id: string;
  student_number: string;
  year_group: string;

  fullName: string;

  constructor(user: UserDataInterface) {
    this.id = user.id;
    this.email = user.email;
    this.name_first = user.name_first;
    this.name_insertion = user.name_insertion;
    this.name_last = user.name_last;
    this.name_initials = user.name_initials;
    this.payment_method = user.payment_method;
    this.phone_number = user.phone_number;
    this.photo_id = user.photo_id;
    this.student_number = user.student_number;
    this.year_group = user.year_group;

    let name = this.name_first;
    name += this.name_insertion ? ` ${this.name_insertion}` : '';
    name += ' ' + this.name_last;
    this.fullName = name;
  }
}
