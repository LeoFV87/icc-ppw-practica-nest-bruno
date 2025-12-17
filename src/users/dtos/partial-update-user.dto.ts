export class PartialUpdateUserDto {
	constructor(
		public name?: string,
		public email?: string,
		public password?: string,
	) {}
}

export default PartialUpdateUserDto;
