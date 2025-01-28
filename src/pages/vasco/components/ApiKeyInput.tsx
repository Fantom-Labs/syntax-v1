import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

interface ApiKeyInputProps {
  onApiKeySubmit: (apiKey: string) => void;
}

export const ApiKeyInput = ({ onApiKeySubmit }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApiKeySubmit(apiKey);
    // Store in localStorage for persistence
    localStorage.setItem('football_api_key', apiKey);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Football Data API Key Required</CardTitle>
        <CardDescription>
          Please enter your Football-Data.org API key to fetch live match data.
          You can get a free API key at{" "}
          <a 
            href="https://www.football-data.org/client/register" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            football-data.org
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <Input
            type="password"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Submit</Button>
        </form>
      </CardContent>
    </Card>
  );
};