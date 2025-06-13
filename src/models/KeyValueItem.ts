class KeyValueItem {
	key: string;
	value: string;

	constructor(key: string, value: string) {
		this.key = key;
		this.value = value;
	}

	toJson(): { key: string; value: string } {
		return {
			key: this.key,
			value: this.value,
		};
	}

	static fromJson(json: { key: string; value: string }): KeyValueItem {
		return new KeyValueItem(json.key, json.value);
	}
}

export { KeyValueItem };
