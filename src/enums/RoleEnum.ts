const RoleEnum = Object.freeze({
	System: "System",
	Admin: "Admin",
	Manager: "Manager",
	TeamLeader: "TeamLeader",
	Agent: "Agent",
} as const);

type RoleEnumType = (typeof RoleEnum)[keyof typeof RoleEnum];

const RoleEnumValues = Object.freeze({
	[RoleEnum.System]: 1,
	[RoleEnum.Admin]: 10,
	[RoleEnum.Manager]: 20,
	[RoleEnum.TeamLeader]: 30,
	[RoleEnum.Agent]: 40,
	Unknown: 100,
} as const);

type RoleEnumValuesType = (typeof RoleEnumValues)[keyof typeof RoleEnumValues];

const RoleEnumHelper = {
	toRoleEnum: (roleName: string): RoleEnumType | null => {
		if (roleName in RoleEnum) {
			return RoleEnum[roleName as keyof typeof RoleEnum];
		}
		return null;
	},

	toRoleEnumValue: (roleName: string): RoleEnumValuesType => {
		return (
			RoleEnumValues[roleName as keyof typeof RoleEnumValues] ??
			RoleEnumValues.Unknown
		);
	},
};

//INFO Usage Examples
// console.log(RoleEnum.Agent); // Output: 'Agent'
// console.log(RoleEnumValues[RoleEnum.Admin]); // Output: 10
// console.log(RoleEnumHelper.toRoleEnum('Manager')); // Output: 'Manager'
// console.log(RoleEnumHelper.toRoleEnumValue('TeamLeader')); // Output: 30
// console.log(RoleEnumHelper.toRoleEnumValue('InvalidRole')); // Output: 100

export { RoleEnum, RoleEnumHelper, RoleEnumValues };
