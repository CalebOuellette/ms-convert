"use client";

import { TZDate } from "@date-fns/tz";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const COMMON_TIMEZONES: string[] = [
  "Pacific/Honolulu", // Hawaii (UTC-10)
  "America/Los_Angeles", // US West Coast (UTC-8 / UTC-7 DST)
  "America/Denver", // US Mountain Time (UTC-7 / UTC-6 DST)
  "America/New_York", // US East Coast (UTC-5 / UTC-4 DST)
  "America/Sao_Paulo", // Brazil (UTC-3)
  "Europe/London", // UK (UTC / UTC+1 DST)
  "Europe/Berlin", // Central Europe (UTC+1 / UTC+2 DST)
  "Asia/Dubai", // UAE (UTC+4)
  "Asia/Tokyo", // Japan (UTC+9)
  "Australia/Sydney", // Australia (UTC+10 / UTC+11 DST)
];

export default function Home() {
  const [myTimeInMs, setMyTimeInMs] = useState(new Date().getTime());
  const [timeZone, setTimeZone] = useState(COMMON_TIMEZONES[3]);
  const [useSeconds, setUseSeconds] = useState(false);

  const currentTimeZone = new TZDate(myTimeInMs);
  const customTimeZone = currentTimeZone.withTimeZone(timeZone);

  const displayValue = useSeconds ? Math.floor(myTimeInMs / 1000) : myTimeInMs;
  const unit = useSeconds ? "seconds" : "milliseconds";

  const handleInputChange = (value: number) => {
    const timeInMs = useSeconds ? value * 1000 : value;
    setMyTimeInMs(timeInMs);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const number = Number(text);
      if (!isNaN(number)) {
        handleInputChange(number);
      }
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Time Zone Converter</CardTitle>
          <CardDescription>
            Convert timestamps between time zones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="number"
              value={displayValue}
              onChange={(e) => handleInputChange(Number(e.target.value))}
              placeholder={`Time in ${unit}`}
            />
            <Button onClick={() => setMyTimeInMs(new Date().getTime())}>
              Now
            </Button>
            <Button onClick={handlePaste} variant="outline">
              Paste
            </Button>
          </div>

          <Select
            value={timeZone}
            onValueChange={(value) => setTimeZone(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              {COMMON_TIMEZONES.map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Local
              </div>
              <div className="text-sm">{currentTimeZone.toString()}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                {timeZone}
              </div>
              <div className="text-sm">{customTimeZone.toString()}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="unit-toggle"
              checked={useSeconds}
              onCheckedChange={setUseSeconds}
            />
            <label htmlFor="unit-toggle" className="text-sm font-medium">
              Use seconds (Python-friendly)
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
