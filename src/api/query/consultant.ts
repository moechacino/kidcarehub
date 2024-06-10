export class ConsultantQuery {
  static select(): object {
    return {
      id: true,
      username: true,
      name: true,
      email: true,
      profession: true,
      photoProfileUrl: true,
      alumnus: true,
      strNumber: true,
      workPlace: true,
    };
  }
}
