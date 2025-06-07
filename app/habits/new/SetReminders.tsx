import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowDown, ArrowUp, Link } from "lucide-react";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollableContent } from "@/components/ScrollableContent";
import { HabitData, Reminder } from "@/types/habit";
import { Step3Data } from "./wizard-data";

type Behavior = {
  title: string;
  description: string;
}

const mockSelectedMicroBehaviors: Behavior[] = [
  {
    title: "喝水",
    description: "每天喝水",
  },
  {
    title: "吃饭",
    description: "每天吃饭",
  },
  {
    title: "睡觉",
    description: "每天睡觉",
  },
];

type AnchorOption = {
  id: string;
  label: string;
  description: string;
}

const anchorOptions: AnchorOption[] = [
  { id: "morning-brush", label: "早上刷牙后", description: "利用晨间例行公事" },
  { id: "coffee", label: "喝咖啡/茶时", description: "与日常饮品习惯结合" },
  { id: "lunch-break", label: "午休时间", description: "利用工作间隙" },
  { id: "before-sleep", label: "睡前", description: "作为放松活动" },
  { id: "commute", label: "通勤路上", description: "利用交通时间" },
]

type ReminderSettingType = "anchor" | "timer";

class ReminderSetting {
  id: string; // 唯一标识符，用于页面逻辑
  behavior: Behavior;
  type: ReminderSettingType;
  time?: string;
  anchor?: AnchorOption;
  expanded: boolean;

  constructor(
    id: string,
    behavior: Behavior,
    type: ReminderSettingType = "anchor",
    expanded: boolean = false,
    time?: string,
    anchor?: AnchorOption
  ) {
    this.id = id;
    this.behavior = behavior;
    this.type = type;
    this.expanded = expanded;
    this.time = time;
    this.anchor = anchor;
  }

  isComplete(): boolean {
    if (this.type === "anchor") {
      return !!this.anchor;
    } else if (this.type === "timer") {
      return !!this.time;
    }
    return false;
  }

  getDisplayText(): string {
    if (this.type === "anchor") {
      if (this.anchor) {
        return `自然提醒（${this.anchor.label}）`;
      } else {
        return "自然提醒（未选择锚点）";
      }
    } else if (this.type === "timer") {
      if (this.time) {
        return `定时提醒：${this.time}`;
      } else {
        return "定时提醒（未选择时间）";
      }
    }
    return "";
  }

  withExpandedToggled(): ReminderSetting {
    return new ReminderSetting(this.id, this.behavior, this.type, !this.expanded, this.time, this.anchor);
  }

  withType(type: ReminderSettingType): ReminderSetting {
    return new ReminderSetting(this.id, this.behavior, type, this.expanded, this.time, this.anchor);
  }

  withAnchor(anchor: AnchorOption): ReminderSetting {
    return new ReminderSetting(this.id, this.behavior, this.type, this.expanded, this.time, anchor);
  }

  withTime(time: string): ReminderSetting {
    return new ReminderSetting(this.id, this.behavior, this.type, this.expanded, time, this.anchor);
  }
}

const useReminderSettings = (behaviors: Behavior[]) => {
  const initialReminderSettings: Record<string, ReminderSetting> = Object.fromEntries(
    behaviors.map((behavior, index) => {
      const id = `reminder-setting-${index + 1}`;
      return [ id, new ReminderSetting(id, behavior) ]
    })
  );

  const [reminderSettings, setReminderSettings] = useState<Record<string, ReminderSetting>>(initialReminderSettings);

  const toggleCardExpanded = (setting: ReminderSetting) => {
    setReminderSettings((prev) => ({
      ...prev,
      [setting.id]: setting.withExpandedToggled(),
    }));
  }

  const setReminderType = (setting: ReminderSetting, type: ReminderSettingType) => {
    setReminderSettings((prev) => ({
      ...prev,
      [setting.id]: setting.withType(type),
    }));
  }

  const setReminderAnchor = (setting: ReminderSetting, anchorId: string) => {
    const anchorOption = anchorOptions.find(option => option.id === anchorId);
    if (anchorOption) {
      setReminderSettings((prev) => ({
        ...prev,
        [setting.id]: setting.withAnchor(anchorOption),
      }));
    }
  }

  const setReminderTime = (setting: ReminderSetting, time: string) => {
    setReminderSettings((prev) => ({
      ...prev,
      [setting.id]: setting.withTime(time),
    }));
  }

  return {
    reminderSettings,
    toggleCardExpanded,
    setReminderType,
    setReminderAnchor,
    setReminderTime,
  };
}

export default function SetReminders({
  habitData,
  reportStep3Data
}: {
  habitData: HabitData;
  reportStep3Data: (data: Step3Data) => void;
}) {
  const {
    reminderSettings,
    toggleCardExpanded,
    setReminderType,
    setReminderAnchor,
    setReminderTime,
  } = useReminderSettings(habitData.behaviors);

  // 当 reminderSettings 发生变化时，报告给父组件
  useEffect(() => {
    const reminders: Reminder[] = Object.values(reminderSettings).map(setting => ({
      type: setting.type,
      anchor: setting.anchor?.id,
      time: setting.time,
    }));
    reportStep3Data({ reminders });
  }, [reminderSettings, reportStep3Data]);

  const ReminderSettingTypeRadioGroup = ({ setting }: { setting: ReminderSetting }) => {
    const reminderOptions: {
      value: ReminderSettingType;
      icon: React.ElementType;
      title: string;
      description: string;
      recommended: boolean;
    }[] = [
      {
        value: "anchor",
        icon: Link,
        title: "自然提醒（推荐）",
        description: "与现有习惯关联，更容易记住",
        recommended: true,
      },
      {
        value: "timer",
        icon: Clock,
        title: "定时提醒",
        description: "设置固定时间提醒",
        recommended: false,
      }
    ];

    const isSelected = (value: ReminderSettingType) => setting.type === value;

    return (
      <>
        <Label className="text-text-primary font-medium mb-3 block">选择提醒方式</Label>
        <RadioGroup
          value={setting.type}
          onValueChange={(value) => setReminderType(setting, value as ReminderSettingType)}
        >
          <div className="space-y-3">
            {reminderOptions.map((option) =>
              <Card
                key={option.value}
                className={`${isSelected(option.value) ? 'border-brand-secondary bg-blue-50' : 'border-surface-divider'}`}
              >
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`${option.value}-${setting.id}`} />
                    <Label htmlFor={`${option.value}-${setting.id}`} className="flex-1 cursor-pointer">
                      <div className="flex items-center">
                        <option.icon className={`w-4 h-4 mr-2 ${option.recommended ? 'text-brand-secondary' : 'text-text-secondary'}`} />
                        <span className="font-medium text-text-primary">{option.title}</span>
                      </div>
                      <p className="text-sm text-text-secondary mt-1">{option.description}</p>
                    </Label>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </RadioGroup>
      </>
    )
  }

  const ReminderSettingAnchorSelect = ({ setting }: { setting: ReminderSetting }) => {
    return (
      <>
        <Label className="text-text-primary font-medium">选择锚点习惯</Label>
        <Select
          value={setting.anchor?.id}
          onValueChange={(value) => setReminderAnchor(setting, value)}
        >
          <SelectTrigger className="mt-2 border-surface-divider">
            <SelectValue placeholder="选择一个现有的日常习惯" />
          </SelectTrigger>
          <SelectContent>
            {anchorOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-text-secondary">{option.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </>
    )
  }

  const ReminderSettingTimerSelect = ({ setting }: { setting: ReminderSetting }) => {
    return (
      <>
        <Label className="text-text-primary font-medium">选择提醒时间</Label>
        <Select
          value={setting.time}
          onValueChange={(value) => setReminderTime(setting, value)}
        >
          <SelectTrigger className="mt-2 border-surface-divider">
            <SelectValue placeholder="选择每天的提醒时间" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="06:00">早上 6:00</SelectItem>
            <SelectItem value="07:00">早上 7:00</SelectItem>
            <SelectItem value="08:00">早上 8:00</SelectItem>
            <SelectItem value="09:00">早上 9:00</SelectItem>
            <SelectItem value="12:00">中午 12:00</SelectItem>
            <SelectItem value="18:00">下午 6:00</SelectItem>
            <SelectItem value="19:00">下午 7:00</SelectItem>
            <SelectItem value="20:00">下午 8:00</SelectItem>
            <SelectItem value="21:00">下午 9:00</SelectItem>
            <SelectItem value="22:00">下午 10:00</SelectItem>
          </SelectContent>
        </Select>
      </>
    )
  }

  const ReminderSettingCardExpanded = ({ setting }: { setting: ReminderSetting }) => {
    return (
      <Card className="border-surface-divider">
        <CardHeader
          className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => toggleCardExpanded(setting)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle className="text-base text-text-primary">{setting.behavior.title}</CardTitle>
              <p className="text-sm text-text-secondary">{setting.behavior.description}</p>
            </div>
            <div className="ml-2">
              <ArrowUp className="w-4 h-4 text-text-secondary" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <ReminderSettingTypeRadioGroup setting={setting} />
          </div>
          <div>
            {setting.type === "timer" ? (
              <ReminderSettingTimerSelect setting={setting} />
            ) : (
              <ReminderSettingAnchorSelect setting={setting} />
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const ReminderSettingCardCollapsed = ({ setting }: { setting: ReminderSetting }) => {
    return (
      <Card className="border-surface-divider">
        <CardContent
          className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => toggleCardExpanded(setting)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-text-primary">{setting.behavior.title}</h4>
                <ArrowDown className="w-4 h-4 text-text-secondary" />
              </div>
              <p className="text-sm text-text-secondary mb-2">{setting.behavior.description}</p>
              <div className="flex items-center">
                <span className="text-xs text-text-secondary mr-2">提醒方式:</span>
                <span
                  className={`text-xs ${setting.isComplete() ? "text-brand-primary" : "text-brand-accent"
                    }`}
                >
                  {setting.getDisplayText()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="h-full flex flex-col p-4 pb-0 space-y-2">
      <ScrollableContent>
        <div className="space-y-4">
          {Object.values(reminderSettings)
            .map((setting) => (
              setting.expanded ? (
                <ReminderSettingCardExpanded key={setting.id} setting={setting} />
              ) : (
                <ReminderSettingCardCollapsed key={setting.id} setting={setting} />
              )
            ))}
        </div>
      </ScrollableContent>
    </div >
  )
}