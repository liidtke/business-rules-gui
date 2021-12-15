import { Result } from '$lib/result'
import { isLoading } from '$lib/store';
import { API_URL } from '$lib/Env';

export class Service {

  private api: string;
  private bearerToken: string;
  private headers: any;
  private token: any;

  constructor(token) {
    this.api = API_URL + "/api/";

    this.token = token;

    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `bearer ${token}`
    }
  }

  //temporary
  async init() {
    if (!this.bearerToken) {
      return new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  getStatus() {
    return [
      { id: "Proposed", name: "Proposto" },
      { id: "Implemented", name: "Implementado" },
      { id: "Deprecated", name: "Descontinuado" },
      { id: "Removed", name: "Removido" },
    ];
  }

  async getAreas() {
    isLoading.set(true);
    let request = await fetch(this.api + 'areas', {
      headers: this.headers,
    });
    let response = await request.json();
    isLoading.set(false);
    return response;
  }

  async getRules() {
    isLoading.set(true);
    let request = await fetch(this.api + `rules/`, {
      headers: this.headers,
    });
    let response = await request.json();
    isLoading.set(false);
    return response;
  }

  async getRulesByArea(areaId) {
    isLoading.set(true);
    let request = await fetch(this.api + `rules/?areaId=${areaId}`, {
      headers: this.headers,
    });
    let response = await request.json();
    isLoading.set(false);
    return response;
  }

  async getRule(id) {
    let request = await fetch(this.api + 'rules/' + id, {
      headers: this.headers,
    });
    let response = await request.json();
    return response;
  }

  async getRuleHistory(id) {
    let request = await fetch(this.api + 'rules/' + id + '/history/', {
      headers: this.headers,
    });
    let response = await request.json();
    return response;
  }

  async saveArea(area) {
    if (!area || !area.name) {
      return;
    }

    let method = 'POST';
    if (area.id) {
      method = "PUT"
    }

    const res: Response = await fetch(this.api + 'areas', {
      method: method,
      headers: this.headers,
      body: JSON.stringify(area)
    })

    if (res.ok) {
      let data = await res.json();
      return Result.Ok(data);
    }
    else {
      return Result.Error("Error saving");
    }
  }

  async saveRule(rule) {
    let validation = this.validateRule(rule);
    if (validation.isError) {
      return validation;
    }

    let res: Response;

    if (rule.id) {
      res = await fetch(this.api + 'rules', {
        method: 'PUT',
        body: JSON.stringify(rule),
        headers: this.headers,
      });
    }
    else {
      res = await fetch(this.api + 'rules', {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(rule)
      })
    }

    if (res.ok) {
      let data = await res.json();
      return Result.Ok(data);
    }
    else {
      //TODO add message
      return Result.Error("Error saving");
    }
  }

  async removeRule(rule) {
    let res: Response;

    if (!rule) { return; }

    res = await fetch(this.api + 'rules/' + rule.id, {
      method: 'DELETE',
      body: JSON.stringify(rule),
      headers: this.headers,
    });

    if (res.ok) {
      return Result.Succeed();
    }
    else {
      return Result.Error("Error deleting");
    }
  }

  validateRule(rule: IRule) {
    if (!rule) {
      return Result.Error("Invalid Rule");
    }

    let validation = new Result(true);
    if (!rule.code && rule.id) {
      validation.addValidation('code', 'Required');
    }

    if (!rule.areaId || rule.areaId === "") {
      validation.addValidation('areaId', 'Required');
    }

    if (!rule.title) {
      validation.addValidation('title', 'Required');
    }

    if (!rule.status) {
      validation.addValidation('status', 'Required');
    }

    return validation;

  }

}

export interface IRule {
  id?: string;
  code: string;
  title: string;
  text: string;
  areaId: string;
  status: string;
  tags: string[];
  _isVisible?: boolean;
}

export interface IArea {
  id?: string;
  name: string;
  //rules: IRule[];
  prefix: string;
  startNumber: number;
  currentNumber: number;

  _hasChild?: boolean;
}
