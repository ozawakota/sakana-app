'use client'

import { useEffect, useState } from 'react'
import { toast } from "@/components/ui/use-toast"
import { Loader2, Trash2, Edit2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSession } from 'next-auth/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface TweetData {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  nickname: string | null;
}

export default function TweetList() {
  const [tweets, setTweets] = useState<TweetData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const [tweetToDelete, setTweetToDelete] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tweetToEdit, setTweetToEdit] = useState<TweetData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  async function fetchTweets() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tweets');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTweets(data);
    } catch (error) {
      console.error('Failed to fetch tweets:', error);
      toast({
        title: "エラー",
        description: "ツイートの取得に失敗しました。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTweets();
  }, []);

  async function deleteTweet() {
    if (tweetToDelete === null) return;

    try {
      const response = await fetch(`/api/tweet/${tweetToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "成功",
        description: "ツイートが削除されました。",
      });

      fetchTweets();
    } catch (error) {
      console.error('Failed to delete tweet:', error);
      toast({
        title: "エラー",
        description: "ツイートの削除に失敗しました。",
        variant: "destructive",
      });
    } finally {
      setTweetToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  }

  async function editTweet() {
    if (tweetToEdit === null) return;

    if (editedContent.trim().length < 2) {
      setEditError("2文字以上入力してください。");
      return;
    }

    try {
      const response = await fetch(`/api/tweet/${tweetToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editedContent.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "成功",
        description: "ツイートが更新されました。",
      });

      fetchTweets();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Failed to edit tweet:', error);
      toast({
        title: "エラー",
        description: "ツイートの更新に失敗しました。",
        variant: "destructive",
      });
    } finally {
      setTweetToEdit(null);
      setEditError(null);
    }
  }

  function handleDeleteClick(tweetId: number) {
    setTweetToDelete(tweetId);
    setIsDeleteDialogOpen(true);
  }

  function handleEditClick(tweet: TweetData) {
    setTweetToEdit(tweet);
    setEditedContent(tweet.content);
    setEditError(null);
    setIsEditDialogOpen(true);
  }

  if (isLoading) {
    return <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="ツイートを読み込み中" />;
  }

  return (
    <div className="space-y-4">
      {tweets.map((tweet) => (
        <Card key={tweet.id}>
          <CardHeader>
            <CardTitle>{tweet.nickname || '名無しさん'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{tweet.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              投稿日時: {new Date(tweet.createdAt).toLocaleString()}
            </p>
            {tweet.updatedAt !== tweet.createdAt && (
              <p className="text-sm text-gray-500">
                更新日時: {new Date(tweet.updatedAt).toLocaleString()}
              </p>
            )}
          </CardContent>
          <CardFooter>
            {session && session.user && session.user.id === tweet.userId && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditClick(tweet)}
                  className="mr-2"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  編集
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteClick(tweet.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  削除
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      ))}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ツイートの削除</DialogTitle>
            <DialogDescription>
              このツイートを削除してもよろしいですか？この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={deleteTweet}>
              削除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ツイートの編集</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-content">内容</Label>
              <Textarea
                id="edit-content"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                placeholder="ツイート内容"
              />
              {editError && <p className="text-red-500 text-sm mt-1">{editError}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsEditDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={editTweet}>
              更新
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}