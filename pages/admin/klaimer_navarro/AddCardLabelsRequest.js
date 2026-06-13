export default class AddCardLabelsRequest {

    constructor(labelIds = []) {
        this.labelIds = labelIds;
    }

    toJson() {

        return {
            labelIds: this.labelIds
        };

    }

}