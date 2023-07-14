import {Component, EventEmitter, Output} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {DocumentService} from '../../../services/document.service';

@Component({
  selector: 'app-personalise',
  templateUrl: './personalise.component.html',
  styleUrls: ['./personalise.component.scss'],
})
export class PersonaliseComponent {
  team_name!: string;

  personalizeData: any[] = [];
  isWhatBringsYou: boolean = true;
  isPersonalize: boolean = false;
  isYourTeamType: boolean = false;
  isYourPlanModal: boolean = false;
  isTeamCreated: boolean = false;
  isWhatBringsYouValidator: boolean = false;
  isPersonalizeValidator: boolean = false;
  isYourTeamTypeValidator: boolean = false;
  isYourPlanModalValidator: boolean = false;
  isTeamCreatedValidator: boolean = false;
  skipPersonalize: boolean = false;
  whatBringsYou: any;
  personalize: any;
  yourTeamType: any;
  yourTeamSize: any;
  yourPlanModal: any;
  teamCreated: any;
  @Output() valueChange = new EventEmitter();

  constructor(public authService: AuthService, public documentService: DocumentService) {
  }

  ngOnInit() {
    this.getpersonalizeQuestions();
    const isSkipped = localStorage.getItem('isSkipped');
    if (isSkipped === 'true') {
      this.skippedPersonalize();
    }
  }

  getpersonalizeQuestions() {
    this.authService.getPersonalize().subscribe({
      next: (res) => {
        this.personalizeData = res.data;
      },
      error: (err) => {
      },
    });
  }

  savePersonalizeQuestions() {
    const data = {
      user_id: JSON.parse(localStorage.getItem("id") as any),
      question: [
        {
          id: 1,
          answer_id: this.whatBringsYou
        }, {
          id: 2,
          answer_id: this.personalize
        },
        {
          id: 3,
          answer_id: this.yourTeamType
        },
        {
          id: 4,
          answer_id: this.yourTeamSize
        },
        {
          id: 5,
          answer_id: this.yourPlanModal
        }
      ]
    }

    this.authService.savePersonalizePrefrence(data).subscribe({
      next: (res) => {
      },
      error: (err) => {
      },
    });
  }

  createTeamName() {
    if (!this.team_name) {
      this.isTeamCreatedValidator = true;
      return;
    }
    const data = {
      team_name: this.team_name,
      description: 'First Team of User',
    };
    // this.valueChange.emit("Team created");

    this.authService.createTeam(data).subscribe({
      next: (res: any) => {
        if (!this.skipPersonalize) {
          this.savePersonalizeQuestions()
        }
        this.setDefault(res.data.id)
        this.valueChange.emit("Team created");
      },
      error: (err) => {
      },
    });
  }

  setDefault(id: any) {
    this.documentService.setDefaultTeams(id).subscribe({
      next: (res) => {
        this.sendTokenToChromeExtension({
          extensionId: 'nnindblljkmlneohokfekacghdepmial',
          teamId: res.data.id,
        });
        this.documentService.emitChangeTeamEvent();
      },
      error: (err) => {
        err.error.message;
      },
    });
  }

  sendTokenToChromeExtension({extensionId, teamId}: any) {
    try {
      // chrome.runtime.sendMessage(
      //   'nnindblljkmlneohokfekacghdepmial',
      //   {action: 'checkInstalled'},
      //   (response: any) => {
      //     if (response) {
      //       chrome.runtime.sendMessage(
      //         extensionId,
      //         {teamId},
      //         (response: any) => {
      //           if (!response.success) {
      //             // console.log('error sending message', response);
      //             return response;
      //           }
      //           // console.log('Sucesss ::: ', response.message);
      //         }
      //       );
      //     } else {
      //     }
      //   }
      // );
    } catch (error) {
    }
  }

  getMyTeam() {
    this.authService.getUserTeam().subscribe({
      next: (res) => {
      },
      error: (err) => {
      },
    });
  }

  next(
    BringsYou: boolean,
    Personalize: boolean,
    YourTeamType: boolean,
    YourPlan: boolean,
    YourTeamName: boolean,
    index: any
  ) {
    if (index == 1) {
      if (this.whatBringsYou == undefined) {
        this.isWhatBringsYouValidator = true;
      } else {
        this.changeState(BringsYou, Personalize, YourTeamType, YourPlan, YourTeamName);
      }
    } else if (index == 2) {
      if (this.personalize == undefined) {
        this.isPersonalizeValidator = true;
      } else {
        this.changeState(BringsYou, Personalize, YourTeamType, YourPlan, YourTeamName);
      }
    } else if (index == 3) {
      if (this.yourTeamType == undefined || this.yourTeamSize == undefined) {
        this.isYourTeamTypeValidator = true;
      } else {
        this.changeState(BringsYou, Personalize, YourTeamType, YourPlan, YourTeamName);
      }
    } else if (index == 4) {
      if (this.yourPlanModal == undefined) {
        this.isYourPlanModalValidator = true;
      } else {
        this.changeState(BringsYou, Personalize, YourTeamType, YourPlan, YourTeamName);
      }
    } else if (index == 0) {
      this.changeState(BringsYou, Personalize, YourTeamType, YourPlan, YourTeamName);
    }
  }

  changeState(
    BringsYou: boolean,
    Personalize: boolean,
    YourTeamType: boolean,
    YourPlan: boolean,
    YourTeamName: boolean
  ) {
    this.isWhatBringsYou = BringsYou;
    this.isPersonalize = Personalize;
    this.isYourTeamType = YourTeamType;
    this.isYourPlanModal = YourPlan;
    this.isTeamCreated = YourTeamName;
  }

  whatBringsYouEvent(ev: any, index: any) {
    if (index == 1) {
      this.whatBringsYou = ev.target.value;
    } else if (index == 2) {
      this.personalize = ev.target.value;
    } else if (index == 4) {
      this.yourPlanModal = ev.target.value;
    }
  }

  skippedPersonalize() {
    this.skipPersonalize = true;
    localStorage.setItem('isSkipped', String(this.skipPersonalize));
    this.changeState(false, false, false, false, true)
  }
}
